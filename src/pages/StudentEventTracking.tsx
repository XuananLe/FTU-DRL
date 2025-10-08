import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonBadge,
  RefresherEventDetail
} from '@ionic/react';
import { EventTrackingService } from '../services/event-tracking.service';
import { EventStatus, EventTracking, Event } from '../types/event-tracking';
import { StudentEventTrackingCard } from '../components/StudentEventTrackingCard';

const StudentEventTracking: React.FC = () => {
  const [trackings, setTrackings] = useState<EventTracking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredTrackings, setFilteredTrackings] = useState<EventTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<EventStatus | 'all'>('all');

  // Simulate current user ID
  const currentUserId = 'current-user';
  const trackingService = new EventTrackingService();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTrackings();
  }, [trackings, selectedFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userTrackings, eventsData] = await Promise.all([
        trackingService.getUserTrackings(currentUserId),
        trackingService.getEvents()
      ]);
      
      setTrackings(userTrackings);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTrackings = () => {
    let filtered = [...trackings];

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(t => t.status === selectedFilter);
    }

    // Sort by registration date (newest first)
    filtered.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

    setFilteredTrackings(filtered);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadData();
    event.detail.complete();
  };

  const getEventById = (eventId: string): Event | undefined => {
    return events.find(e => e.id === eventId);
  };

  const getStatusCount = (status: EventStatus): number => {
    return trackings.filter(t => t.status === status).length;
  };

  const getStatusText = (status: EventStatus): string => {
    switch (status) {
      case EventStatus.REGISTERED:
        return 'Đã đăng ký';
      case EventStatus.PARTICIPATED:
        return 'Đã tham gia';
      case EventStatus.CHECKED_OUT:
        return 'Đã hoàn thành';
      case EventStatus.COULD_NOT_PARTICIPATE:
        return 'Không tham gia được';
      case EventStatus.COULD_NOT_CHECK_OUT:
        return 'Chưa hoàn thành';
      case EventStatus.CANCELLED:
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="danger">
            <IonTitle>Theo dõi Sự kiện</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar 
          color="danger"
          style={{
            '--background': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
          }}
        >
          <IonTitle style={{ 
            fontWeight: 'bold',
            fontSize: '1.2em',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            Sự kiện của tôi
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Clean Statistics Overview */}
        <div style={{ 
          background: 'white',
          padding: '24px 20px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0',
            maxWidth: '100%'
          }}>
            <div style={{ 
              textAlign: 'center', 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                fontSize: '2em', 
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '6px',
                lineHeight: '1'
              }}>
                {trackings.length}
              </div>
              <div style={{ 
                fontSize: '0.85em', 
                color: '#666',
                fontWeight: '500'
              }}>
                Tổng số
              </div>
            </div>
            
            <div style={{ 
              width: '1px', 
              height: '50px', 
              backgroundColor: '#e0e0e0',
              margin: '0 24px'
            }} />
            
            <div style={{ 
              textAlign: 'center', 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                fontSize: '2em', 
                fontWeight: 'bold',
                color: '#dc2626',
                marginBottom: '6px',
                lineHeight: '1'
              }}>
                {getStatusCount(EventStatus.PARTICIPATED) + getStatusCount(EventStatus.CHECKED_OUT)}
              </div>
              <div style={{ 
                fontSize: '0.85em', 
                color: '#666',
                fontWeight: '500'
              }}>
                Đã tham gia
              </div>
            </div>
            
            <div style={{ 
              width: '1px', 
              height: '50px', 
              backgroundColor: '#e0e0e0',
              margin: '0 24px'
            }} />
            
            <div style={{ 
              textAlign: 'center', 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                fontSize: '2em', 
                fontWeight: 'bold',
                color: '#dc2626',
                marginBottom: '6px',
                lineHeight: '1'
              }}>
                {getStatusCount(EventStatus.CHECKED_OUT)}
              </div>
              <div style={{ 
                fontSize: '0.85em', 
                color: '#666',
                fontWeight: '500'
              }}>
                Hoàn thành
              </div>
            </div>
          </div>
        </div>

        {/* Clean Filter Tabs - No Scroll Needed */}
        <div style={{ 
          padding: '16px 20px',
          background: '#f8f9fa',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <IonGrid style={{ padding: 0 }}>
            <IonRow>
              {[
                { key: 'all', label: 'Tất cả', shortLabel: 'Tất cả', count: trackings.length },
                { key: EventStatus.REGISTERED, label: 'Chờ tham gia', shortLabel: 'Chờ', count: getStatusCount(EventStatus.REGISTERED) },
                { key: EventStatus.PARTICIPATED, label: 'Đã tham gia', shortLabel: 'Tham gia', count: getStatusCount(EventStatus.PARTICIPATED) },
                { key: EventStatus.CHECKED_OUT, label: 'Hoàn thành', shortLabel: 'Hoàn thành', count: getStatusCount(EventStatus.CHECKED_OUT) }
              ].map((filter) => (
                <IonCol size="3" key={filter.key}>
                  <div
                    onClick={() => setSelectedFilter(filter.key as any)}
                    style={{
                      width: '100%',
                      padding: '12px 8px',
                      borderRadius: '12px',
                      background: selectedFilter === filter.key ? '#dc2626' : 'white',
                      color: selectedFilter === filter.key ? 'white' : '#333',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                      border: selectedFilter === filter.key ? 'none' : '1px solid #e0e0e0',
                      boxShadow: selectedFilter === filter.key 
                        ? '0 2px 8px rgba(220, 38, 38, 0.3)'
                        : '0 1px 3px rgba(0, 0, 0, 0.1)',
                      minHeight: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: '0.85em',
                      fontWeight: selectedFilter === filter.key ? 'bold' : '500',
                      marginBottom: '2px',
                      lineHeight: '1.2'
                    }}>
                      {filter.shortLabel}
                    </div>
                    <div style={{
                      fontSize: '1.1em',
                      opacity: selectedFilter === filter.key ? 1 : 0.7,
                      fontWeight: 'bold'
                    }}>
                      {filter.count}
                    </div>
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>

        {/* Event Cards */}
        <div style={{ 
          padding: '20px',
          background: '#f8f9fa'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              margin: '0',
              color: '#333',
              fontWeight: '600',
              fontSize: '1em'
            }}>
              {selectedFilter === 'all' 
                ? `Tất cả sự kiện` 
                : `${getStatusText(selectedFilter as EventStatus)}`
              }
            </h3>
            <span style={{ 
              color: '#666',
              fontSize: '0.9em'
            }}>
              {filteredTrackings.length} sự kiện
            </span>
          </div>

          {filteredTrackings.length === 0 ? (
            <IonCard style={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <IonCardContent style={{ 
                textAlign: 'center', 
                padding: '48px 32px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
              }}>
                <div style={{ 
                  fontSize: '64px', 
                  margin: '0 0 16px 0',
                  opacity: 0.5
                }}>
                  📋
                </div>
                <h3 style={{ 
                  margin: '0 0 8px 0',
                  color: '#333',
                  fontSize: '1.1em'
                }}>
                  Không có sự kiện
                </h3>
                <p style={{ 
                  margin: '0',
                  color: '#666',
                  fontSize: '0.9em',
                  lineHeight: '1.4'
                }}>
                  {selectedFilter === 'all' 
                    ? 'Bạn chưa đăng ký sự kiện nào' 
                    : `Không có sự kiện nào có trạng thái "${getStatusText(selectedFilter as EventStatus)}"`
                  }
                </p>
              </IonCardContent>
            </IonCard>
          ) : (
            filteredTrackings.map((tracking) => (
              <StudentEventTrackingCard
                key={tracking.id}
                tracking={tracking}
                event={getEventById(tracking.eventId)}
                showStudentInfo={false}
              />
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StudentEventTracking;