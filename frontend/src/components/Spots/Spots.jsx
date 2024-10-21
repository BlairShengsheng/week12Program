import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllSpotsThunks } from '../../store/spots';
import { Link } from 'react-router-dom';
import './Spots.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from "@fortawesome/fontawesome-free-solid";

const imageFilenames = [
  'previewImage1.jpg',
  'previewImage2.jpg',
  'previewImage3.jpg',
  'previewImage4.jpg',
  'previewImage5.jpg',
];

export function Spots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.allSpots.allSpots);
  const reviews = useSelector(state => state.reviews.spotReviews);
  const [spotsWithImages, setSpotsWithImages] = useState([]);

  useEffect(() => {
    dispatch(setAllSpotsThunks());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(spots).length > 0) {
      const updatedSpots = Object.values(spots).map((spot, index) => {
        const assignedImage = imageFilenames[index % imageFilenames.length];
        
        // Calculate average rating for this specific spot
        let avgRating = 'New';
        const spotReviews = Object.values(reviews).filter(review => review.spotId === spot.id);
        
        if (spotReviews.length > 0) {
          const starValues = spotReviews.map(review => review.stars);
          const totalStars = starValues.reduce((sum, stars) => sum + stars, 0);
          avgRating = (totalStars / starValues.length).toFixed(1);
        }

        return {
          ...spot,
          previewImage: assignedImage,
          smallImages: [
            imageFilenames[(index + 1) % imageFilenames.length],
            imageFilenames[(index + 2) % imageFilenames.length],
            imageFilenames[(index + 3) % imageFilenames.length],
            imageFilenames[(index + 4) % imageFilenames.length],
          ],
          avgRating
        };
      });
      setSpotsWithImages(updatedSpots);
    }
  }, [spots, reviews]);

  return (
    <>
      <div className="spots-container">
        {spotsWithImages.map((spot, i) => (
          <Link to={`/spots/${spot.id}`} key={i}>
            <div
              className="single-spot-container"
              title={spot.name}
            >
              <div className="spot-placeholder">
                <img
                  src={`/images/${spot.previewImage}`}
                  alt={spot.name}
                  className="spot-image"
                />
                <div className="empty-block1">{spot.city}, {spot.state}</div>
                <div className="empty-block2">${spot.price}/night</div>
                <div className='star-icon'>
                  <FontAwesomeIcon icon={faStar} color='black'/>
                  {spot.avgRating}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
