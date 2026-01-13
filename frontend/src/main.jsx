import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './store/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster 
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1f2937',
              fontSize: '14px',
              fontWeight: '500',
              padding: '16px 24px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
            },
            success: {
              duration: 4000,
              style: {
                background: '#10b981',
                color: '#ffffff',
                fontWeight: '600',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#10b981',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
                color: '#ffffff',
                fontWeight: '600',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#ef4444',
              },
            },
            loading: {
              style: {
                background: '#0ea5e9',
                color: '#ffffff',
                fontWeight: '600',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#0ea5e9',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
