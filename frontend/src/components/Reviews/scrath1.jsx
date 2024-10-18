import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotReviewsThunk, createReviewThunk, deleteReviewThunk } from '../../store/reviews';
import './Reviews.css'; // You'll need to create this CSS file

export function Reviews({ spotId }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const reviews = useSelector(state => state.reviews.spotReviews);

  const [showModal, setShowModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getSpotReviewsThunk(spotId))
    .then(() => console.log('reviews fetch successfully!'))
    .catch(error => console.error('Error fetching reviews:', error))
  }, [dispatch, spotId]);

  const handleOpenModal = () => {
    setShowModal(true);
    setReviewText('');
    setRating(0);
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStarHover = (hoveredRating) => {
    if (!rating) setRating(hoveredRating);
  };

  const handleStarClick = (clickedRating) => {
    setRating(clickedRating);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrors({});
  
    if (reviewText.length < 10) {
      setErrors({review: "Review must be at least 10 characters long"});
      return;
    }
    if (rating === 0) {
      setErrors({rating: "Please select a star rating"});
      return;
    }
  
    const reviewData = { review: reviewText, stars: rating };
    try {
      const result = await dispatch(createReviewThunk(spotId, reviewData));
      if (result && result.id) {
        handleCloseModal();
        dispatch(getSpotReviewsThunk(spotId)); // Refresh reviews after submission
      } else {
        setErrors({ submission: "Failed to submit review. Please try again." });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrors({ submission: "An error occurred. Please try again." });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(deleteReviewThunk(reviewId));
      dispatch(getSpotReviewsThunk(spotId)); // Refresh reviews after deletion
    } catch (error) {
      console.error("Error deleting review:", error);
      // Optionally, you can set an error state here to display to the user
    }
  };

  const averageRating = reviews.length ? (reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length).toFixed(1) : 'New';
  const canPostReview = sessionUser && !reviews.find(review => review.userId === sessionUser.id);

  return (
    <div className="reviews-section">
      <h2>★ {averageRating} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</h2>
      
      {canPostReview && (
        <button onClick={handleOpenModal} className="post-review-button">Post Your Review</button>
      )}

      {showModal && (
        <div className="review-modal">
          <h3>How was your stay?</h3>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Leave your review here..."
          />
          {errors.review && <p className="error">{errors.review}</p>}
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={() => handleStarHover(0)}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
            <span>Stars</span>
          </div>
          {errors.rating && <p className="error">{errors.rating}</p>}
          <button 
            onClick={handleSubmitReview} 
            disabled={reviewText.length < 10 || rating === 0}
          >
            Submit Your Review
          </button>
          <button onClick={handleCloseModal}>Cancel</button>
        </div>
      )}

      {reviews.map((review) => (
        <div key={review.id} className="review">
          <h3>{review.User.firstName}</h3>
          <p>{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          <p>{review.review}</p>
          {sessionUser && sessionUser.id === review.userId && (
            <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  )
}
