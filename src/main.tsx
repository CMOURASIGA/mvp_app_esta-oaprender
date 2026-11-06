import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Registro oficial do Service Worker PWA
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Falha no registro do Service Worker:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);

