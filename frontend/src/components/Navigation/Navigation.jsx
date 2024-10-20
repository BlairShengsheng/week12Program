// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
// import{Link} from 'react-router-dom'
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';






//icon stuff
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAirbnb} from '@fortawesome/free-brands-svg-icons'


function Navigation({ isLoaded }) {



  const sessionUser = useSelector(state => state.session.user);

  return (
  <>
    <div className='Nav-container'>
      <div className='airbnb-icon' onClick={() => window.location.href= '/'}>
        <FontAwesomeIcon icon={faAirbnb} size='2x' color="red"/>
        <span className='airbnb-home-text'>airbnb</span>
      </div>


      <ul>
        <li>
          <NavLink to="/spots/new">Create A New Spot</NavLink>
        </li>
        {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
       )}
      </ul>

    </div>
  </>

  );
}

export default Navigation;
