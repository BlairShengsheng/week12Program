// frontend/src/App.jsx

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Welcome!</h1> // Simple welcome page for now
  },
  {
    path: '/login',
    element: <LoginFormPage />  // Login page route
  }
]);


function App() {
  // return <h1> Hello from App </h1>;
  return <RouterProvider router={router} />
}

export default App;
