import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './apple-design-system.css';
import { App } from './App';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
