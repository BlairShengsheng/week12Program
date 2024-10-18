import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { setAllSpotsThunks } from '../../store/spots';
import { Reviews } from '../Reviews/Reviews';// import Reviews component
import './SpotsDetails.css';

export function SpotsDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spots = useSelector((state) => state.allSpots.allSpots);
  const spot = Object.values(spots).find((spot) => spot.id === Number(spotId));

  useEffect(() => {
    dispatch(setAllSpotsThunks());
  }, [dispatch]);

  if (!spot) {
    return <h1>Spot Not Found</h1>;
  }

  return (
    <div className="spots-detail-container">
      <h1>{spot.name}</h1>
      <p className="location">{spot.city}, {spot.state}, {spot.country}</p>

      <div className="image-gallery">
        <div className="large-image">
          <img src={spot.mainImage} alt="Main view of spot" />
        </div>
        <div className="small-images">
          <img src={spot.secondaryImage1} alt="Secondary view 1" />
          <img src={spot.secondaryImage2} alt="Secondary view 2" />
          <img src={spot.secondaryImage3} alt="Secondary view 3" />
          <img src={spot.secondaryImage4} alt="Secondary view 4" />
        </div>
      </div>

      <div className="spot-info-container">
        <div className="spot-description">
          <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
          <p>{spot.description}</p>
        </div>

        <div className="reservation-box">
          <div className="price-rating">
            <span className="price">${spot.price} night</span>
            <span className="rating">★ {spot.avgRating?.toFixed(1)} · {spot.numReviews} reviews</span>
          </div>
          <button className="reserve-button">Reserve</button>
        </div>
      </div>

      <Reviews 
        spotId={spot.id} 
        avgRating={spot.avgRating} 
        numReviews={spot.numReviews} 
      />
    </div>
  );
}
