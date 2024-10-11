// frontend/src/App.jsx
import { useState, useEffect } from 'react'; //<-- ADD THIS LINE
import { useDispatch } from 'react-redux';//<-- ADD THIS LINE

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';

import * as sessionActions from './store/session'//<-- ADD THIS LINE

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);// track if the user is loaded

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true) // Set isLoaded to true after session restoration
    });
  }, [dispatch]);

  // Render routes only after session is restored 
  return (
    <>
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1> // Simple welcome page for now
      },
      {
        path: '/login',
        element: <LoginFormPage />  // Login page route
      }

    ]
  }

])


function App() {
  // return <h1> Hello from App </h1>;
  return <RouterProvider router={router} />
}

export default App;
