import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotReviewsThunk, createReviewThunk, deleteReviewThunk } from '../../store/reviews';
import './Reviews.css';

export function Reviews({ spotId , onReviewChange, isOwner}) { // also pass function here as hook
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const reviews = useSelector(state => state.reviews.spotReviews);

  const allReviews = Object.values(reviews);
  const sortedReviews = allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));// make newly created current review goes to the top of the review list

  const spot = useSelector(state => state.allSpots.singleSpot); 

  const [showModal, setShowModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);


  const [theStar, setStar] = useState(0);
  useEffect(() => {
    if (allReviews.length > 0) {
      const starValues = allReviews.map(review => review.stars);
      const totalStars = starValues.reduce((sum, star) => sum + star, 0);
      const avgStar = totalStars/ starValues.length;
      setStar(avgStar); // theStar = avgStar
    }
  }, [allReviews]);


  

  useEffect(() => {
    
    dispatch(getSpotReviewsThunk(spotId))// same as using: onReviewChange();
    
      .then(() => console.log('reviews fetched successfully!'))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [dispatch, spotId]);



  let canPostReview = false;

  if (sessionUser && spot && !isOwner) { // check if the person is log in and also the spot exists
    const hasUserReviewed = allReviews.find(review => review.userId === sessionUser.id); // check if the person has posted review on this spot before or not


    if (!hasUserReviewed) { // if this person hasn't post any review for this place yet and also he is not the owner of ths place
      canPostReview = true; 
    }
 }


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
        dispatch(getSpotReviewsThunk(spotId)); // Refresh reviews after submission same as using : onReviewChange();
      } else {
        setErrors({ submission: "Failed to submit review. Please try again." });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrors({ submission: "An error occurred. Please try again." });
    }
  };

  const handleDeleteClick = (reviewId) => {
    setShowDeleteModal(true);
    setReviewIdToDelete(reviewId);
  }

  const handleConfirmDelete = async () => {
    try {
      if(reviewIdToDelete){
        await dispatch(deleteReviewThunk(reviewIdToDelete));
        // await dispatch(getSpotReviewsThunk(spotId)); // Refresh reviews after deletion
        await onReviewChange();
        setShowDeleteModal(false);
        setReviewIdToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setReviewIdToDelete(null);
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        {/* <h2>
          ★{" "}
          {theStar > 0 && allReviews.length !== 0 ? theStar.toFixed(1) : "New"}{" "}
          · {allReviews.length} {allReviews.length > 1 ? "reivews" : "review"}
        </h2> */}

        <h2>
          ★{" "}
          {theStar > 0 && allReviews.length !== 0
            ? `${theStar.toFixed(1)} · ${allReviews.length} ${
                allReviews.length > 1 ? "reviews" : "review"
              }`
            : "New"}
        </h2>
      </div>

      <div className="reviews-content">
        {!isOwner && canPostReview && ( // change here 
          <button onClick={handleOpenModal} className="post-review-button">
            Post Your Review
          </button>
        )}

        {allReviews.length === 0 && canPostReview && (
          <h4>Be the first to post a review!</h4>
        )}
      </div>

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
                className={`star ${star <= rating ? "filled" : ""}`}
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

      {sortedReviews.map((review) => (
        <div key={review.id} className="review">
          <h3>{review.User.firstName}</h3>
          <p>
            {new Date(review.createdAt).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>{review.review}</p>

          {sessionUser && sessionUser.id === review.userId && (
            <button
              onClick={() => handleDeleteClick(review.id)}
              className="delete-review-button"
            >
              Delete
            </button>
          )}
        </div>
      ))}

      {showDeleteModal && (
        <div className="delete-container">
          <h2>Confirm Delete</h2>
          <h4>Are you sure you want to delete this review?</h4>
          <button
            onClick={handleConfirmDelete}
            className="confirm-delete-button"
          >
            Yes (Delete Review)
          </button>
          <button onClick={handleCancelDelete} className="cancel-delete-button">
            No (Keep Review)
          </button>
        </div>
      )}
    </div>
  );
}

export default Reviews;
