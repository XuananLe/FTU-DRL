import React, { useState } from 'react';
import './ChatbotLogo.css';
import { ChatWindow } from './ChatWindow';

interface ChatbotLogoProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export default function ChatbotLogo({ 
  position = 'bottom-right', 
  size = 'small',
  onClick 
}: ChatbotLogoProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsChatOpen(!isChatOpen);
    }
  };

  const chatPosition = position === 'bottom-left' || position === 'top-left' ? 'bottom-left' : 'bottom-right';

  return (
    <>
      <div 
        className={`chatbot-logo ${position} ${size} clickable ${isChatOpen ? 'active' : ''}`}
        onClick={handleClick}
      >
        <img src="/logo.png" alt="FTU Assistant" />
        {!isChatOpen && (
          <div className="notification-dot">
            <span>💬</span>
          </div>
        )}
      </div>
      
      <ChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        position={chatPosition}
      />
    </>
  );
}