import React, { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonTextarea,
  IonCheckbox,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAlert,
  IonButtons,
  IonChip
} from '@ionic/react';
import { 
  logoLinkedin, 
  shareOutline, 
  closeOutline,
  checkmarkCircleOutline,
  trophyOutline,
  ribbonOutline
} from 'ionicons/icons';
import { EventTracking, Event, EventStatus } from '../types/event-tracking';

interface LinkedInShareProps {
  tracking: EventTracking;
  event?: Event;
}

interface LinkedInPost {
  title: string;
  description: string;
  hashtags: string[];
  includeImage: boolean;
  includeCompletionBadge: boolean;
}

export const LinkedInShare: React.FC<LinkedInShareProps> = ({ tracking, event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [postData, setPostData] = useState<LinkedInPost>({
    title: '',
    description: '',
    hashtags: ['#FTU', '#ProfessionalDevelopment', '#StudentLife', '#Networking'],
    includeImage: true,
    includeCompletionBadge: true
  });

  // Only show share button for completed events
  const canShare = tracking.status === EventStatus.CHECKED_OUT || tracking.status === EventStatus.PARTICIPATED;

  if (!canShare) return null;

  const generatePostContent = (): LinkedInPost => {
    const isCompleted = tracking.status === EventStatus.CHECKED_OUT;
    const eventTitle = tracking.eventName;
    const eventDate = new Date(event?.date || tracking.participatedAt || new Date());
    const formattedDate = eventDate.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const title = isCompleted 
      ? `🎯 Successfully completed: ${eventTitle}`
      : `✅ Participated in: ${eventTitle}`;

    const description = `I'm excited to share that I ${isCompleted ? 'successfully completed' : 'participated in'} "${eventTitle}" hosted by Foreign Trade University (FTU) on ${formattedDate}.

${event?.description ? `📋 About the event: ${event.description}` : ''}

${event?.location ? `📍 Venue: ${event.location}` : ''}

${isCompleted 
  ? '🏆 This experience has enhanced my professional skills and expanded my network in the business community.'
  : '🌟 This was a valuable learning experience that contributed to my professional development.'
}

Thank you to the organizers and fellow participants for making this a memorable experience!

#FTU #ForeignTradeUniversity #ProfessionalDevelopment #StudentAchievement #Networking #CareerGrowth`;

    return {
      title,
      description,
      hashtags: ['#FTU', '#ProfessionalDevelopment', '#StudentAchievement', '#Networking', '#CareerGrowth'],
      includeImage: true,
      includeCompletionBadge: isCompleted
    };
  };

  const handleOpenModal = () => {
    const generatedContent = generatePostContent();
    setPostData(generatedContent);
    setIsModalOpen(true);
  };

  const handleQuickShare = () => {
    const generatedContent = generatePostContent();
    
    // LinkedIn Share URL parameters
    const linkedinParams = new URLSearchParams({
      mini: 'true',
      url: window.location.origin + `/events/${tracking.eventId}`,
      title: generatedContent.title,
      summary: generatedContent.description,
      source: 'FTU Student Portal'
    });

    // Open LinkedIn sharing window
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?${linkedinParams.toString()}`;
    
    window.open(
      linkedinUrl,
      'linkedin-share',
      'width=600,height=500,scrollbars=yes,resizable=yes'
    );

    setShowSuccess(true);
  };

  const handleLinkedInShare = async () => {
    setIsSharing(true);
    
    try {
      // LinkedIn Share URL parameters
      const linkedinParams = new URLSearchParams({
        mini: 'true',
        url: window.location.origin + `/events/${tracking.eventId}`, // Link back to event
        title: postData.title,
        summary: postData.description,
        source: 'FTU Student Portal'
      });

      // Open LinkedIn sharing window
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?${linkedinParams.toString()}`;
      
      window.open(
        linkedinUrl,
        'linkedin-share',
        'width=600,height=500,scrollbars=yes,resizable=yes'
      );

      // Simulate API call to log sharing activity
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsModalOpen(false);
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error sharing to LinkedIn:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCustomPost = () => {
    // Create a formatted post for copy-paste
    const customPost = `${postData.title}

${postData.description}

${postData.hashtags.join(' ')}`;

    navigator.clipboard.writeText(customPost).then(() => {
      setIsModalOpen(false);
      setShowSuccess(true);
    });
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
        <IonButton
          fill="solid"
          size="small"
          color="danger"
          onClick={handleQuickShare}
          style={{
            '--background': '#dc2626',
            '--color': 'white'
          }}
        >
          <IonIcon icon={logoLinkedin} slot="start" />
          Share LinkedIn
        </IonButton>
        
        <IonButton
          fill="outline"
          size="small"
          color="danger"
          onClick={handleOpenModal}
          style={{
            '--border-color': '#dc2626',
            '--color': '#dc2626'
          }}
        >
          <IonIcon icon={shareOutline} slot="start" />
          Tùy chỉnh
        </IonButton>
      </div>

      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar color="danger">
            <IonTitle style={{ textAlign: 'center' }}>Chia sẻ lên LinkedIn</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          {/* Preview Card */}
          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IonIcon 
                  icon={tracking.status === EventStatus.CHECKED_OUT ? trophyOutline : ribbonOutline}
                  style={{ color: '#0077b5', fontSize: '24px' }}
                />
                <IonCardTitle style={{ fontSize: '1.1em', color: '#dc2626' }}>
                  Thành tích nghề nghiệp
                </IonCardTitle>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
                {postData.title}
              </h3>
              <p style={{ 
                fontSize: '0.9em', 
                lineHeight: '1.4', 
                color: '#666',
                whiteSpace: 'pre-line' 
              }}>
                {postData.description.substring(0, 200)}
                {postData.description.length > 200 && '...'}
              </p>
              <div style={{ marginTop: '12px' }}>
                {postData.hashtags.map((tag) => (
                  <IonChip key={tag} color="danger" outline>
                    {tag}
                  </IonChip>
                ))}
              </div>
            </IonCardContent>
          </IonCard>

          {/* Customization Options */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle style={{ fontSize: '1em' }}>Tùy chỉnh bài đăng</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel>Nội dung bài đăng</IonLabel>
              </IonItem>
              <IonTextarea
                value={postData.description}
                onIonInput={(e) => setPostData({
                  ...postData,
                  description: e.detail.value!
                })}
                placeholder="Chỉnh sửa nội dung bài đăng..."
                rows={6}
                style={{
                  '--background': '#f8f9fa',
                  '--border-radius': '8px',
                  '--padding': '12px',
                  margin: '8px 0'
                }}
              />

              <IonList>
                <IonItem lines="none">
                  <IonCheckbox
                    slot="start"
                    checked={postData.includeImage}
                    onIonChange={(e) => setPostData({
                      ...postData,
                      includeImage: e.detail.checked
                    })}
                  />
                  <IonLabel style={{ 
                    marginLeft: '16px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    Bao gồm hình ảnh sự kiện
                  </IonLabel>
                </IonItem>

                <IonItem lines="none">
                  <IonCheckbox
                    slot="start"
                    checked={postData.includeCompletionBadge}
                    onIonChange={(e) => setPostData({
                      ...postData,
                      includeCompletionBadge: e.detail.checked
                    })}
                  />
                  <IonLabel style={{ 
                    marginLeft: '16px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    Bao gồm huy hiệu hoàn thành
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Share Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginTop: '20px' 
          }}>
            <IonButton
              expand="block"
              color="danger"
              onClick={handleLinkedInShare}
              disabled={isSharing}
              style={{
                '--background': '#dc2626',
                flex: 1
              }}
            >
              <IonIcon icon={logoLinkedin} slot="start" />
              {isSharing ? 'Đang chia sẻ...' : 'Chia sẻ LinkedIn'}
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              color="danger"
              onClick={handleCustomPost}
              style={{ 
                flex: 1,
                '--border-color': '#dc2626',
                '--color': '#dc2626'
              }}
            >
              <IonIcon icon={shareOutline} slot="start" />
              Sao chép bài
            </IonButton>
          </div>

        </IonContent>
      </IonModal>

      <IonAlert
        isOpen={showSuccess}
        header="Thành công!"
        message="Thành tích của bạn đã được chuẩn bị để chia sẻ lên LinkedIn. Điều này sẽ giúp thể hiện sự phát triển nghề nghiệp của bạn với các nhà tuyển dụng!"
        buttons={[{
          text: 'Tuyệt vời!',
          handler: () => setShowSuccess(false)
        }]}
      />
    </>
  );
};