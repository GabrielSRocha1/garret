
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("[GARRETT] System initializing in production mode...");

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("[GARRETT] Critical: Root container not found in DOM.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("[GARRETT] Interface mounted successfully.");
  } catch (err) {
    console.error("[GARRETT] Mount sequence failed:", err);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: white; font-family: monospace; text-align: center; margin-top: 20%;">
        <h1 style="color: #ef4444;">INITIALIZATION ERROR</h1>
        <p style="color: #64748b;">The secure engine failed to start. Please refresh the page.</p>
        <pre style="font-size: 10px; color: #334155; margin-top: 20px;">${String(err)}</pre>
      </div>
    `;
  }
};

// Garantir que o DOM esteja pronto antes de montar
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountApp();
} else {
  window.addEventListener('DOMContentLoaded', mountApp);
}
