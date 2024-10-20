import { csrfFetch } from "./csrf";



//! --------------------------------------------------------------------
//*                        Regular Action type
//! --------------------------------------------------------------------

const SET_SPOT_REVIEWS = 'reviews/SET_SPOT_REVIEWS';
const ADD_REVIEWS = 'reviews/ADD_REVIEWS';
// const EDIT_REVIEWS = 'reviews/EDIT_REVIEWS';
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

// export const editReview = (updatedReview) => {
//   return {
//     type: EDIT_REVIEWS,
//     updatedReview
//   }
// }

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

      dispatch(setSpotReviews(data.Reviews));
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};


//Add a review by its spotId
export const createReviewThunk = (spotId, reviewData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (response.ok) {
      const data = await response.json();

    //  await dispatch(addReview(data));
     await dispatch(getSpotReviewsThunk(spotId));
     return data;
    }
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

//Edit a review by its reviewId
// export const updateReviewThunk = (reviewId, reviewData) => async(dispatch) => {
//   const response = csrfFetch(`api/reviews/${reviewId}`, {
//     method:"PUT",
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify(reviewData),
//   });

//   if(response.ok) {
//     const updateReview = response.json();
//     dispatch(editReview(updateReview));
//     // dispatch(getSpotReviewsThunk(spotId));
//   } else {
//     const errors = await response.json();
//     return errors;
//   }
// }

//Delete a review by its reviewId
export const deleteReviewThunk = (reviewId, spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      await dispatch(deletedReview(reviewId));
      await dispatch (getSpotReviewsThunk(spotId))
      return { success: true };
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};








//! --------------------------------------------------------------------
//*                          Reducer
//! --------------------------------------------------------------------

//initial state
const initialState = {
  spotReviews: {}
};


export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    
    case SET_SPOT_REVIEWS:
      return { ...state, spotReviews: {
        ...action.reviews.reduce((acc,review)=> {
          acc[review.id] = review;
          return acc
        }, {})
      }}

    
    // case ADD_REVIEWS:
    //   return {...state, spotReviews:[...state.spotReviews, action.review]};

    // case EDIT_REVIEWS:
    //   return {
    //     ...state, 
    //     spotReviews:state.spotReviews.map(review => review.id === action.updatedReview.id ? {...review, ...action.updatedReview} : review)
    //   }

    case DELETE_REVIEWS: {
      const newState = {...state};
      delete newState.spotReviews[action.reviewId];
      return newState;
    }

    default:
      return state;
  }

}
