
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllSpotsThunks } from '../../store/spots';
import { Link } from 'react-router-dom';
import './Spots.css';


//icon stuff

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from "@fortawesome/fontawesome-free-solid";


 //! --------------------------------------------------------------------
 //*                          Spots Component
 //! --------------------------------------------------------------------

export function Spots() {
  const dispatch = useDispatch();
 
  
  // allSpots is reducer from rootreducer, spots is a key in initialstate (find it in the reducer)
  const spots = useSelector((state) => state.allSpots.spots);

   // Sort spots by newest first
  //  const sortedSpots = [...spots].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  useEffect(() => {
    dispatch(setAllSpotsThunks());
  }, [dispatch]);

    return (
      <>
        <div className="spots-container">

          {spots.map((spot, i) => (// spots from useSelector

            <Link to={`/spots/${spot.id}`} key={i}>

              <div key={i} className="single-spot-container">
                <div className="spot-placeholder">

                 
                  <div className="empty-block1">{spot.city},{spot.state}</div>

                  <div className="empty-block2">${spot.price}/night</div>
                  
                  <div className='star-icon'>
                  <FontAwesomeIcon icon={faStar} color='black'/>ratings
                  </div>
            

                </div>


              </div>

            </Link>

          ))}
        </div>
      </>
    );
}
