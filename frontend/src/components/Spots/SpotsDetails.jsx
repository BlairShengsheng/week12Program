import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setAllSpotsThunks } from '../../store/spots';

import { Reviews } from '../Reviews/Reviews';// import Reviews component
import './SpotsDetails.css';


import { getSpotReviewsThunk } from '../../store/reviews';// import Thunk from reviews store

export function SpotsDetails() {

  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spots = useSelector((state) => state.allSpots.allSpots);
  const spot = Object.values(spots).find((spot) => spot.id === Number(spotId));
  // console.log("let me see what is inside:", spot.previewImage)
  // const spot = spots[spotId];

  const reviews = useSelector( state => state.reviews.spotReviews);//an object
  const reviewArray = Object.values(reviews)//an array of reviews' objects

  // const starValues = reviewArray .map(review => review.stars)// an array of all star values
  // const totalStar = starValues.reduce((sum, star) => sum + star,0)
  // const avgStar = totalStar/ starValues.length;
  // console.log("please show me inside:", avgStar);

  const [theStar, setStar] = useState(0);

  useEffect(() => {
    dispatch(setAllSpotsThunks());
    // dispatch (deleteReviewThunk( spotId))
    dispatch(getSpotReviewsThunk(spotId));
  }, [dispatch,spotId]);


  useEffect(() => {
    if (reviewArray.length > 0) {
      const starValues = reviewArray.map(review => review.stars);
      const totalStars = starValues.reduce((sum, star) => sum + star, 0);
      const avgStar = totalStars/ starValues.length;
      setStar(avgStar); // theStar = avgStar
    } else {
      setStar(0);
    }
  }, [reviewArray]);


  if (!spot) {
    return <h1>Spot Not Found</h1>;
  }

  return (
    <div className="spots-detail-container">
      <h1>{spot.name}</h1>
      <p className="location">{spot.city}, {spot.state}, {spot.country}</p>

      <div className="image-gallery">
        <div className="large-image">
          <img src={`/images/${spot.previewImage}`} alt="Main view of spot" />
        </div>
        {/* <div className="small-images">
          <img src={spot.secondaryImage1} alt="Secondary view 1" />
          <img src={spot.secondaryImage2} alt="Secondary view 2" />
          <img src={spot.secondaryImage3} alt="Secondary view 3" />
          <img src={spot.secondaryImage4} alt="Secondary view 4" />
        </div> */}
        <div className="small-images">
          {spot.smallImages && spot.smallImages.map((img, index) => (
            <img key={index} src={`/images/${img}`} alt={`Secondary view ${index + 1}`} />
          ))}
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
            <span className="rating">★ {theStar > 0 ? theStar.toFixed(1): "New"} · {reviewArray.length > 1 ? "reivews": "review"}</span>
          </div>
          <button className="reserve-button">Reserve</button>
        </div>
      </div>

      <Reviews 
        spotId={spot.id} 
        onReviewChange={() => dispatch(getSpotReviewsThunk(spotId))}// refetch all the reviews agains/ like a hook over here


      />
    </div>
  );
}
