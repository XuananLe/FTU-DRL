import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail
} from '@ionic/react';
import { EventTrackingService } from '../services/event-tracking.service';
import { EventStatus, EventTracking, Event, EventStatistics } from '../types/event-tracking';
import { EventTrackingCard } from './EventTrackingCard';

export const EventTrackingDashboard: React.FC = () => {
  const [trackings, setTrackings] = useState<EventTracking[]>([]);
  const [filteredTrackings, setFilteredTrackings] = useState<EventTracking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [statistics, setStatistics] = useState<EventStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'all'>('all');

  const trackingService = new EventTrackingService();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTrackings();
  }, [trackings, searchText, selectedEvent, selectedStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [trackingsData, eventsData, statsData] = await Promise.all([
        trackingService.getAllTrackings(),
        trackingService.getEvents(),
        trackingService.getEventStatistics()
      ]);
      
      setTrackings(trackingsData);
      setEvents(eventsData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTrackings = () => {
    let filtered = [...trackings];

    // Filter by search text (MSSV or name)
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(t => 
        t.studentId.toLowerCase().includes(lowerSearch) ||
        t.studentName.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by event
    if (selectedEvent !== 'all') {
      filtered = filtered.filter(t => t.eventId === selectedEvent);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    setFilteredTrackings(filtered);
  };

  const handleStatusUpdate = async (trackingId: string, newStatus: EventStatus, reason?: string) => {
    try {
      await trackingService.updateEventStatus(trackingId, newStatus, reason, 'admin');
      await loadData(); // Reload to show updated status
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadData();
    event.detail.complete();
  };

  const getStatusText = (status: EventStatus): string => {
    switch (status) {
      case EventStatus.REGISTERED:
        return 'Đã đăng ký';
      case EventStatus.PARTICIPATED:
        return 'Đã tham gia';
      case EventStatus.CHECKED_OUT:
        return 'Đã check out';
      case EventStatus.COULD_NOT_PARTICIPATE:
        return 'Không tham gia được';
      case EventStatus.COULD_NOT_CHECK_OUT:
        return 'Không check out được';
      case EventStatus.CANCELLED:
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <IonSpinner name="crescent" />
        </div>
      </IonContent>
    );
  }

  return (
    <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      {/* Statistics Cards */}
      {statistics && (
        <IonGrid>
          <IonRow>
            <IonCol size="6" sizeMd="4">
              <IonCard>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: '0', color: '#3880ff' }}>{statistics.totalRegistered}</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9em' }}>Đã đăng ký</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6" sizeMd="4">
              <IonCard>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: '0', color: '#2dd36f' }}>{statistics.totalParticipated}</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9em' }}>Đã tham gia</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6" sizeMd="4">
              <IonCard>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: '0', color: '#8b5cf6' }}>{statistics.totalCheckedOut}</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9em' }}>Đã check out</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6" sizeMd="4">
              <IonCard>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: '0', color: '#eb445a' }}>{statistics.totalCouldNotParticipate}</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9em' }}>Không tham gia được</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6" sizeMd="4">
              <IonCard>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: '0', color: '#ffc409' }}>{statistics.totalCouldNotCheckOut}</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9em' }}>Không check out được</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6" sizeMd="4">
              <IonCard>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: '0', color: '#92949c' }}>{statistics.totalCancelled}</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9em' }}>Đã hủy</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonCard>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: '0', color: '#2dd36f' }}>{statistics.participationRate}%</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9em' }}>Tỷ lệ tham gia</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard>
                <IonCardContent>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: '0', color: '#8b5cf6' }}>{statistics.checkoutRate}%</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9em' }}>Tỷ lệ check out</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      )}

      {/* Search and Filters */}
      <div className="ion-padding">
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="Tìm kiếm MSSV hoặc tên sinh viên..."
          showClearButton="focus"
        />

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonItem>
                <IonLabel>Sự kiện:</IonLabel>
                <IonSelect
                  value={selectedEvent}
                  onIonChange={(e) => setSelectedEvent(e.detail.value)}
                >
                  <IonSelectOption value="all">Tất cả sự kiện</IonSelectOption>
                  {events.map((event) => (
                    <IonSelectOption key={event.id} value={event.id}>
                      {event.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonItem>
                <IonLabel>Trạng thái:</IonLabel>
                <IonSelect
                  value={selectedStatus}
                  onIonChange={(e) => setSelectedStatus(e.detail.value)}
                >
                  <IonSelectOption value="all">Tất cả trạng thái</IonSelectOption>
                  {Object.values(EventStatus).map((status) => (
                    <IonSelectOption key={status} value={status}>
                      {getStatusText(status)}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>

      {/* Results */}
      <div className="ion-padding">
        <IonText>
          <p>Hiển thị {filteredTrackings.length} kết quả từ tổng {trackings.length} bản ghi</p>
        </IonText>

        {filteredTrackings.length === 0 ? (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center' }}>
              <p>Không có dữ liệu theo dõi nào</p>
            </IonCardContent>
          </IonCard>
        ) : (
          filteredTrackings.map((tracking) => (
            <EventTrackingCard
              key={tracking.id}
              tracking={tracking}
              onStatusUpdate={handleStatusUpdate}
              isAdmin={true}
            />
          ))
        )}
      </div>
    </IonContent>
  );
};