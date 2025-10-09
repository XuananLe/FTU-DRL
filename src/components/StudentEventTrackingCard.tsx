import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonBadge, 
  IonItem, 
  IonLabel, 
  IonNote,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonIcon
} from '@ionic/react';
import { 
  checkmarkCircle, 
  timeOutline, 
  locationOutline, 
  peopleOutline,
  calendarOutline,
  closeCircle,
  warning
} from 'ionicons/icons';
import { EventStatus, EventTracking, Event } from '../types/event-tracking';
import { LinkedInShare } from './LinkedInShare';

interface Props {
  tracking: EventTracking;
  event?: Event;
  showStudentInfo?: boolean;
}

export const StudentEventTrackingCard: React.FC<Props> = ({ 
  tracking, 
  event, 
  showStudentInfo = false 
}) => {
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

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case EventStatus.REGISTERED:
        return <IonIcon icon={timeOutline} style={{ fontSize: '14px' }} />;
      case EventStatus.PARTICIPATED:
        return <IonIcon icon={checkmarkCircle} style={{ fontSize: '14px' }} />;
      case EventStatus.CHECKED_OUT:
        return <IonIcon icon={checkmarkCircle} style={{ fontSize: '14px' }} />;
      case EventStatus.COULD_NOT_PARTICIPATE:
        return <IonIcon icon={closeCircle} style={{ fontSize: '14px' }} />;
      case EventStatus.COULD_NOT_CHECK_OUT:
        return <IonIcon icon={warning} style={{ fontSize: '14px' }} />;
      case EventStatus.CANCELLED:
        return <IonIcon icon={closeCircle} style={{ fontSize: '14px' }} />;
      default:
        return null;
    }
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

  const formatEventDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <IonCard style={{ 
      borderRadius: '16px', 
      margin: '12px 0',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      {/* Event Image with Overlay */}
      <div style={{ position: 'relative' }}>
        {event?.imageUrl && (
          <IonImg 
            src={event.imageUrl} 
            alt={tracking.eventName}
            style={{ 
              height: '180px', 
              objectFit: 'cover',
              width: '100%'
            }}
          />
        )}
        
        {/* Status Badge Overlay */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10
        }}>
          <IonBadge 
            color={getStatusColor(tracking.status)}
            style={{ 
              fontSize: '0.8em',
              padding: '8px 12px',
              borderRadius: '20px',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              backgroundColor: `var(--ion-color-${getStatusColor(tracking.status)})`,
              color: 'white'
            }}
          >
            {getStatusIcon(tracking.status)}
            <span style={{ marginLeft: '4px' }}>{getStatusText(tracking.status)}</span>
          </IonBadge>
        </div>

        {/* Gradient Overlay for better text readability */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          zIndex: 5
        }} />
        
        {/* Event Title on Image */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          right: '16px',
          zIndex: 10
        }}>
          <h2 style={{
            color: 'white',
            margin: 0,
            fontSize: '1.2em',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            lineHeight: '1.3'
          }}>
            {tracking.eventName}
          </h2>
        </div>
      </div>

      <IonCardContent style={{ padding: '20px' }}>
        {/* Event Details */}
        {event && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ 
              color: '#666', 
              margin: '0 0 12px 0',
              lineHeight: '1.5',
              fontSize: '0.9em'
            }}>
              {event.description}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IonIcon icon={calendarOutline} style={{ color: '#3880ff', fontSize: '16px' }} />
                <span style={{ fontSize: '0.9em', color: '#333' }}>
                  {formatEventDate(event.date)}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IonIcon icon={locationOutline} style={{ color: '#eb445a', fontSize: '16px' }} />
                <span style={{ fontSize: '0.9em', color: '#333' }}>
                  {event.location}
                </span>
              </div>
              
              {event.maxParticipants && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IonIcon icon={peopleOutline} style={{ color: '#2dd36f', fontSize: '16px' }} />
                  <span style={{ fontSize: '0.9em', color: '#333' }}>
                    Tối đa {event.maxParticipants} người
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div style={{ 
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <span style={{ 
              fontSize: '0.9em', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Tiến độ sự kiện
            </span>
            <span style={{ 
              fontSize: '0.8em',
              color: getProgressColor(tracking.status),
              fontWeight: 'bold'
            }}>
              {getProgressPercentage(tracking.status)}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#e9ecef', 
            borderRadius: '4px', 
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              width: `${getProgressPercentage(tracking.status)}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${getProgressColor(tracking.status)}, ${getProgressColor(tracking.status)}dd)`,
              transition: 'width 0.5s ease',
              borderRadius: '4px'
            }} />
          </div>
          
          {/* Progress Steps */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '0.75em', 
            color: '#666'
          }}>
            <span style={{ fontWeight: tracking.status !== EventStatus.CANCELLED ? 'bold' : 'normal', color: tracking.status !== EventStatus.CANCELLED ? '#2dd36f' : '#666' }}>
              Đăng ký
            </span>
            <span style={{ fontWeight: [EventStatus.PARTICIPATED, EventStatus.CHECKED_OUT].includes(tracking.status) ? 'bold' : 'normal', color: [EventStatus.PARTICIPATED, EventStatus.CHECKED_OUT].includes(tracking.status) ? '#2dd36f' : '#666' }}>
              Tham gia  
            </span>
            <span style={{ fontWeight: tracking.status === EventStatus.CHECKED_OUT ? 'bold' : 'normal', color: tracking.status === EventStatus.CHECKED_OUT ? '#2dd36f' : '#666' }}>
              Hoàn thành
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ 
            margin: '0 0 12px 0',
            fontSize: '1em',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <IonIcon icon={timeOutline} style={{ color: '#3880ff' }} />
            Lịch sử trạng thái
          </h4>
          
          <div style={{ paddingLeft: '24px', borderLeft: '2px solid #e9ecef' }}>
            <div style={{ 
              marginBottom: '12px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                left: '-28px',
                top: '2px',
                width: '12px',
                height: '12px',
                backgroundColor: '#3880ff',
                borderRadius: '50%',
                border: '3px solid white'
              }} />
              <div style={{ fontSize: '0.85em' }}>
                <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '2px' }}>
                  📝 Đăng ký tham gia
                </div>
                <div style={{ color: '#666' }}>
                  {formatDate(tracking.registeredAt)}
                </div>
              </div>
            </div>
            
            {tracking.participatedAt && (
              <div style={{ 
                marginBottom: '12px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-28px',
                  top: '2px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#2dd36f',
                  borderRadius: '50%',
                  border: '3px solid white'
                }} />
                <div style={{ fontSize: '0.85em' }}>
                  <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '2px' }}>
                    ✅ Đã tham gia sự kiện
                  </div>
                  <div style={{ color: '#666' }}>
                    {formatDate(tracking.participatedAt)}
                  </div>
                </div>
              </div>
            )}
            
            {tracking.checkedOutAt && (
              <div style={{ 
                marginBottom: '12px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-28px',
                  top: '2px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#8b5cf6',
                  borderRadius: '50%',
                  border: '3px solid white'
                }} />
                <div style={{ fontSize: '0.85em' }}>
                  <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '2px' }}>
                    🎯 Hoàn thành sự kiện
                  </div>
                  <div style={{ color: '#666' }}>
                    {formatDate(tracking.checkedOutAt)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes and Reasons */}
        {(tracking.notes || tracking.reason) && (
          <div style={{
            background: tracking.status === EventStatus.COULD_NOT_PARTICIPATE || tracking.status === EventStatus.COULD_NOT_CHECK_OUT 
              ? '#fff5f5' : '#f0f9ff',
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${tracking.status === EventStatus.COULD_NOT_PARTICIPATE || tracking.status === EventStatus.COULD_NOT_CHECK_OUT 
              ? '#fecaca' : '#bfdbfe'}`
          }}>
            {tracking.notes && (
              <div style={{ marginBottom: tracking.reason ? '12px' : '0' }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: '#333',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  💭 Ghi chú
                </div>
                <div style={{ 
                  fontSize: '0.9em', 
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  {tracking.notes}
                </div>
              </div>
            )}
            
            {tracking.reason && (
              <div>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: tracking.status === EventStatus.COULD_NOT_PARTICIPATE || tracking.status === EventStatus.COULD_NOT_CHECK_OUT 
                    ? '#dc2626' : '#059669',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  📋 Lý do
                </div>
                <div style={{ 
                  fontSize: '0.9em', 
                  color: tracking.status === EventStatus.COULD_NOT_PARTICIPATE || tracking.status === EventStatus.COULD_NOT_CHECK_OUT 
                    ? '#dc2626' : '#059669',
                  lineHeight: '1.4'
                }}>
                  {tracking.reason}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LinkedIn Share Component */}
        <div style={{ 
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <LinkedInShare tracking={tracking} event={event} />
        </div>
      </IonCardContent>
    </IonCard>
  );
};

const getProgressPercentage = (status: EventStatus): number => {
  switch (status) {
    case EventStatus.REGISTERED:
      return 33;
    case EventStatus.PARTICIPATED:
      return 66;
    case EventStatus.CHECKED_OUT:
      return 100;
    case EventStatus.COULD_NOT_PARTICIPATE:
    case EventStatus.COULD_NOT_CHECK_OUT:
    case EventStatus.CANCELLED:
      return 0;
    default:
      return 0;
  }
};

const getProgressColor = (status: EventStatus): string => {
  switch (status) {
    case EventStatus.REGISTERED:
      return '#3880ff';
    case EventStatus.PARTICIPATED:
      return '#2dd36f';
    case EventStatus.CHECKED_OUT:
      return '#8b5cf6';
    case EventStatus.COULD_NOT_PARTICIPATE:
    case EventStatus.COULD_NOT_CHECK_OUT:
    case EventStatus.CANCELLED:
      return '#eb445a';
    default:
      return '#92949c';
  }
};