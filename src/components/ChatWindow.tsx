import React, { useState, useRef, useEffect } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonItem,
  IonInput,
  IonTextarea,
  IonList
} from '@ionic/react';
import { 
  closeOutline, 
  sendOutline, 
  chatbubbleEllipsesOutline,
  personCircleOutline 
} from 'ionicons/icons';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'bottom-right' | 'bottom-left';
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  isOpen, 
  onClose, 
  position = 'bottom-right' 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là FTU Assistant. Tôi có thể giúp gì cho bạn?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('sự kiện') || input.includes('event')) {
      return 'Bạn có thể xem và theo dõi các sự kiện của mình trong mục "Theo dõi sự kiện của tôi" nhé!';
    }
    if (input.includes('đăng ký') || input.includes('register')) {
      return 'Để đăng ký sự kiện, bạn vào mục "Sự kiện đăng ký" để xem các sự kiện có sẵn nhé!';
    }
    if (input.includes('điểm') || input.includes('drl')) {
      return 'Bạn có thể xem điểm DRL trong mục "Đánh giá rèn luyện" trên trang cá nhân.';
    }
    if (input.includes('lịch') || input.includes('schedule')) {
      return 'Lịch học của bạn có trong mục "Lịch học" trên trang cá nhân nhé!';
    }
    if (input.includes('help') || input.includes('giúp')) {
      return 'Tôi có thể hỗ trợ bạn về:\n• Sự kiện và đăng ký\n• Điểm rèn luyện\n• Lịch học\n• Thông tin tài khoản\nBạn cần hỗ trợ gì cụ thể?';
    }
    
    return 'Cảm ơn bạn đã nhắn tin! Tôi đang học hỏi thêm để hỗ trợ bạn tốt hơn. Bạn có thể liên hệ admin để được hỗ trợ chi tiết nhé!';
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  const positionStyles = position === 'bottom-right' 
    ? { bottom: '80px', right: '20px' }
    : { bottom: '80px', left: '20px' };

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles,
        width: '320px',
        height: '450px',
        zIndex: 1001,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'white'
      }}
    >
      <IonCard style={{ 
        margin: 0, 
        height: '100%', 
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <IonCardHeader style={{ 
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: 'white',
          padding: '12px 16px',
          minHeight: 'auto'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IonIcon 
                icon={chatbubbleEllipsesOutline} 
                style={{ fontSize: '20px' }} 
              />
              <IonCardTitle style={{ fontSize: '1em', margin: 0 }}>
                FTU Assistant
              </IonCardTitle>
            </div>
            <IonButton 
              fill="clear" 
              size="small"
              onClick={onClose}
              style={{ '--color': 'white', margin: 0 }}
            >
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          <div style={{ 
            fontSize: '0.8em', 
            opacity: 0.9, 
            marginTop: '4px' 
          }}>
            🟢 Đang hoạt động
          </div>
        </IonCardHeader>

        {/* Messages */}
        <IonCardContent style={{ 
          flex: 1, 
          padding: '12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ flex: 1 }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                  marginBottom: '12px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '8px',
                  maxWidth: '80%',
                  flexDirection: message.isBot ? 'row' : 'row-reverse'
                }}>
                  {message.isBot && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <img 
                        src="/logo.png" 
                        alt="Bot" 
                        style={{ width: '16px', height: '16px' }}
                      />
                    </div>
                  )}
                  
                  <div style={{
                    background: message.isBot ? '#f1f5f9' : '#dc2626',
                    color: message.isBot ? '#334155' : 'white',
                    padding: '10px 12px',
                    borderRadius: message.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    fontSize: '0.9em',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {message.text}
                    <div style={{
                      fontSize: '0.7em',
                      opacity: 0.7,
                      marginTop: '4px'
                    }}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </IonCardContent>

        {/* Input */}
        <div style={{ 
          padding: '12px',
          background: '#f8f9fa',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <IonTextarea
              value={inputText}
              onIonInput={(e) => setInputText(e.detail.value!)}
              placeholder="Nhập tin nhắn..."
              rows={1}
              autoGrow={true}
              maxlength={500}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              style={{ 
                '--background': 'white',
                '--color': '#333',
                '--placeholder-color': '#999',
                '--border-radius': '12px',
                '--padding': '8px 12px',
                flex: 1,
                fontSize: '0.9em'
              }}
            />
            <IonButton
              fill="solid"
              color="danger"
              size="small"
              onClick={sendMessage}
              disabled={inputText.trim() === ''}
              style={{ 
                '--border-radius': '12px',
                minWidth: '44px',
                height: '44px'
              }}
            >
              <IonIcon icon={sendOutline} />
            </IonButton>
          </div>
        </div>
      </IonCard>
    </div>
  );
};