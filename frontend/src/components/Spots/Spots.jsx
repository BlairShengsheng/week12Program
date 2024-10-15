
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllSpotsThunks } from '../../store/spots';
import { Link } from 'react-router-dom';
import './Spots.css';


 //! --------------------------------------------------------------------
 //*                          Spots Component
 //! --------------------------------------------------------------------

export function Spots() {
  const dispatch = useDispatch();
 
  
  // allSpots is reducer from rootreducer, spots is a key in initialstate (find it in the reducer)
  const spots = useSelector((state) => state.allSpots.spots);

  useEffect(() => {
    dispatch(setAllSpotsThunks());
  }, [dispatch]);

    return (
      <>
        <div className="spots-container">
          {spots.map((spot, i) => (// spots from useSelector
            <Link to={`/spot/${spot.id}`} key={i}>
              <div key={i} className="single-spot-container">
                <div className="spot-placeholder">
                  <div className="empty-block">{spot.address}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
}
