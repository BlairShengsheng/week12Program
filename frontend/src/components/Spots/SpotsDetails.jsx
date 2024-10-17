
import { useSelector } from 'react-redux';
import './SpotsDetails.css';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setAllSpotsThunks } from '../../store/spots';


//! --------------------------------------------------------------------
//*                          SpotsDetails Component
//! --------------------------------------------------------------------

export function SpotsDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const spots = useSelector((state) => state.allSpots.allSpots);//------change over here

  const spot = Object.values(spots).find((spot) => spot.id === Number(spotId));



  useEffect(() => {
    dispatch(setAllSpotsThunks());
  }, [dispatch]);
  



  if (!spot) {
    return <h1>Spot Not Found</h1>;
  }

  return (
    <>
      <div className="spots-detail-container">
        {/* Image gallery */}
        <div className="image-gallery">
          <div className="large-image">
            <img src={spot.mainImage} alt="Spot" />
          </div>
          <div className="small-images">
            <img src={spot.secondaryImage1} alt="Spot" />
            <img src={spot.secondaryImage2} alt="Spot" />
            <img src={spot.secondaryImage3} alt="Spot" />
            <img src={spot.secondaryImage4} alt="Spot" />
          </div>
        </div>

        {/* Spot details */}
        <div className="spot-info">
          <h1>{spot.name}</h1>
          <p>{spot.city}, {spot.state}</p>
          <p>{spot.description}</p>

          {/* Booking section */}
          <div className="booking-section">
            <div className="price">${spot.price} / night</div>
            <button>Reserve</button>
          </div>
        </div>

        {/* About section */}
        <div className="about-section">
          <h2>About the place</h2>
          <p>{spot.about}</p>
        </div>

        {/* Reviews */}
        <div className="review-section">
          <h2>Reviews</h2>
          {spot.reviews && spot.reviews.length ? (
            spot.reviews.map((review, i) => (
              <div key={i} className="review">
                <div className="review-author">{review.author}</div>
                <div className="review-text">{review.text}</div>
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>
    </>
  );
}
