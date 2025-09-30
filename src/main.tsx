import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { setupIonicReact } from '@ionic/react';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import '@ionic/react/css/core.css';        // core bắt buộc
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';



setupIonicReact(); // khởi tạo Ionic (web components, platform, v.v.)
defineCustomElements(window);
const container = document.getElementById('root')!;
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
