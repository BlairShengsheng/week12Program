// frontend/src/main.jsx
import  React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';

// ... other imports
import * as sessionActions from './store/session'; // <-- ADD THIS LINE


//Create a variable to access your store and expose it on the window
const store = configureStore();
if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions; // <-- ADD THIS LINE
}

// if (process.env.NODE_ENV !== 'production') {
//   window.store = store;
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
