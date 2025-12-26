
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("[GARRETT] Core engine initializing...");

const init = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("[GARRETT] Critical Error: Root element not found.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("[GARRETT] UI Mount Successful.");
  } catch (err) {
    console.error("[GARRETT] Render failure:", err);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
