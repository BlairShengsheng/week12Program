import { csrfFetch } from "./csrf";



//! --------------------------------------------------------------------
//*                        Regular Action type
//! --------------------------------------------------------------------

const SET_SPOT_REVIEWS = 'reviews/SET_SPOT_REVIEWS';
const ADD_REVIEWS = 'reviews/ADD_REVIEWS';
const EDIT_REVIEWS = 'reviews/EDIT_REVIEWS';
const DELETE_REVIEWS = 'reviews/DELETE_REVIEWS';




//! --------------------------------------------------------------------
//*                        Regular Action Creator
//! --------------------------------------------------------------------


export const setSpotReviews = (reviews) => {
  return {
    type: SET_SPOT_REVIEWS, 
    reviews
  }
}

export const addReview = (review) => {
  return {
    type: ADD_REVIEWS,
    review
  }
}

export const editReview = (updatedReview) => {
  return {
    type: EDIT_REVIEWS,
    updatedReview
  }
}

export const deletedReview = (reviewId) => {
  return {
    type: DELETE_REVIEWS,
    reviewId
  }
}

//! --------------------------------------------------------------------
//*                          Thunks
//! --------------------------------------------------------------------




//Fetch all reviews by spotId

export const getSpotReviewsThunk = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const data = await response.json();
      const normalizedReviews = data.Reviews.map(review => ({
        ...review,
        User: review.User || { firstName: 'Anonymous', lastName: '' }
      }));
      dispatch(setSpotReviews(normalizedReviews));
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};


//Add a review by its spotId
export const createReviewThunk = (spotId, reviewData) => async(dispatch) => {
  const response = csrfFetch(`api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(reviewData),
  });
  if(response.ok){
    const newReview = response.json();
    dispatch(addReview(newReview));
    dispatch(getSpotReviewsThunk(spotId))// re-fetch all spots, maintaining consistency with the backend

  } else {
    const errors = await response.json();
    return errors;
  }
}

//Edit a review by its reviewId
export const updateReviewThunk = (reviewId, reviewData) => async(dispatch) => {
  const response = csrfFetch(`api/reviews/${reviewId}`, {
    method:"PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(reviewData),
  });

  if(response.ok) {
    const updateReview = response.json();
    dispatch(editReview(updateReview));
    // dispatch(getSpotReviewsThunk(spotId));
  } else {
    const errors = await response.json();
    return errors;
  }
}

//Delete a review by its reviewId
export const deleteReviewThunk = (reviewId) => async(dispatch) => {
  const response = await csrfFetch(`api/reviews/${reviewId}`,{
    method: "DELETE"
  });
  if(response.ok){
    dispatch(deletedReview(reviewId))
  }
}








//! --------------------------------------------------------------------
//*                          Reducer
//! --------------------------------------------------------------------

//initial state
const initialState = {
  spotReviews: []
};


export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPOT_REVIEWS:
      return {...state, spotReviews: action.reviews};
    
    case ADD_REVIEWS:
      return {...state, spotReviews:[...state.spotReviews, action.review]};

    case EDIT_REVIEWS:
      return {
        ...state, 
        spotReviews:state.spotReviews.map(review => review.id === action.updatedReview.id ? {...review, ...action.updatedReview} : review)
      }

    case DELETE_REVIEWS:
      return {
        ...state,
        spotReviews: state.spotReviews.filter(review => review.id !== action.reviewId)
      }
    
    default:
      return state;
  }

}
