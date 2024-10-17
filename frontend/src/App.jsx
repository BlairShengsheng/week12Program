import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import'./App.css';
import Navigation from './components/Navigation/Navigation';
import { Spots } from './components/Spots/Spots'// import Spots component
import { SpotsDetails } from './components/Spots/SpotsDetails';//import SportsDetails component
import{ CreateASpot } from './components/Spots/CreateASpot';//import CreateASpot component
import { ManageSpot } from './components/Spots/ManageSpot';//import ManageSpot component



//! --------------------------------------------------------------------
//*                          Layout Component
//! --------------------------------------------------------------------
function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}


//! --------------------------------------------------------------------
//*                          Routers
//! --------------------------------------------------------------------
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <>
            <h1>Welcome!</h1>
            <Spots />
          </>
        )
      },
      {
        path: '/spots',
        element: <Spots />
      },
      {
        path: '/spots/:spotId',
        element: <SpotsDetails />
      },
      {
        path: '/spots/new',
        element:<CreateASpot />
      },
      {
        path: 'spots/current',
        element:<ManageSpot />
      }

    ]
  }
]);



//! --------------------------------------------------------------------
//*                          App Component
//! --------------------------------------------------------------------

function App() {
  return <RouterProvider router={router} />;
}

export default App;
