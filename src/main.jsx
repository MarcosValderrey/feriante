import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.jsx';
import { SessionProvider } from './context/SessionContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <SessionProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </SessionProvider>
  // </StrictMode>
);