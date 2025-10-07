import React from 'react';
import './ChatbotLogo.css';

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
  return (
    <div 
      className={`chatbot-logo ${position} ${size} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <img src="/logo.png" alt="FTU Assistant" />
    </div>
  );
}