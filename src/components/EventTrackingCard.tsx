import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonBadge, IonItem, IonLabel, IonNote } from '@ionic/react';
import { EventStatus, EventTracking } from '../types/event-tracking';

interface Props {
  tracking: EventTracking;
  onStatusUpdate: (trackingId: string, newStatus: EventStatus, reason?: string) => void;
  isAdmin?: boolean;
}

export const EventTrackingCard: React.FC<Props> = ({ tracking, onStatusUpdate, isAdmin = false }) => {
  const getStatusColor = (status: EventStatus): string => {
    switch (status) {
      case EventStatus.REGISTERED:
        return 'primary';
      case EventStatus.PARTICIPATED:
        return 'success';
      case EventStatus.CHECKED_OUT:
        return 'tertiary';
      case EventStatus.COULD_NOT_PARTICIPATE:
        return 'danger';
      case EventStatus.COULD_NOT_CHECK_OUT:
        return 'warning';
      case EventStatus.CANCELLED:
        return 'medium';
      default:
        return 'medium'; 
    }
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

  const handleStatusChange = (newStatus: EventStatus) => {
    const reason = prompt('Nhập lý do (tùy chọn):');
    onStatusUpdate(tracking.id, newStatus, reason || undefined);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <IonCard>
      <IonCardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <IonCardTitle style={{ fontSize: '1.1em' }}>{tracking.eventName}</IonCardTitle>
          <IonBadge color={getStatusColor(tracking.status)}>
            {getStatusText(tracking.status)}
          </IonBadge>
        </div>
      </IonCardHeader>

      <IonCardContent>
        <IonItem lines="none">
          <IonLabel>
            <h3>MSSV: {tracking.studentId}</h3>
            <p>Sinh viên: {tracking.studentName}</p>
          </IonLabel>
        </IonItem>

        <IonItem lines="none">
          <IonLabel>
            <p><strong>Đăng ký:</strong> {formatDate(tracking.registeredAt)}</p>
            {tracking.participatedAt && (
              <p><strong>Tham gia:</strong> {formatDate(tracking.participatedAt)}</p>
            )}
            {tracking.checkedOutAt && (
              <p><strong>Check out:</strong> {formatDate(tracking.checkedOutAt)}</p>
            )}
          </IonLabel>
        </IonItem>

        {tracking.notes && (
          <IonItem lines="none">
            <IonLabel>
              <IonNote color="medium">
                <strong>Ghi chú:</strong> {tracking.notes}
              </IonNote>
            </IonLabel>
          </IonItem>
        )}

        {tracking.reason && (
          <IonItem lines="none">
            <IonLabel>
              <IonNote color="medium">
                <strong>Lý do:</strong> {tracking.reason}
              </IonNote>
            </IonLabel>
          </IonItem>
        )}

        {isAdmin && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            {tracking.status === EventStatus.REGISTERED && (
              <>
                <IonButton 
                  size="small" 
                  fill="solid" 
                  color="success"
                  onClick={() => handleStatusChange(EventStatus.PARTICIPATED)}
                >
                  Đã tham gia
                </IonButton>
                <IonButton 
                  size="small" 
                  fill="outline" 
                  color="danger"
                  onClick={() => handleStatusChange(EventStatus.COULD_NOT_PARTICIPATE)}
                >
                  Không tham gia được
                </IonButton>
              </>
            )}

            {tracking.status === EventStatus.PARTICIPATED && (
              <>
                <IonButton 
                  size="small" 
                  fill="solid" 
                  color="tertiary"
                  onClick={() => handleStatusChange(EventStatus.CHECKED_OUT)}
                >
                  Check out
                </IonButton>
                <IonButton 
                  size="small" 
                  fill="outline" 
                  color="warning"
                  onClick={() => handleStatusChange(EventStatus.COULD_NOT_CHECK_OUT)}
                >
                  Không check out được
                </IonButton>
              </>
            )}

            {[EventStatus.REGISTERED, EventStatus.PARTICIPATED].includes(tracking.status) && (
              <IonButton 
                size="small" 
                fill="clear" 
                color="medium"
                onClick={() => handleStatusChange(EventStatus.CANCELLED)}
              >
                Hủy
              </IonButton>
            )}
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};