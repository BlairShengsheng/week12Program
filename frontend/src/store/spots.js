import { csrfFetch } from "./csrf";

//! --------------------------------------------------------------------
//*                        Action Types
//! --------------------------------------------------------------------
const SET_ALL_SPOTS = 'spots/SET_ALL_SPOTS';
const SET_SPOT = 'spots/SET_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const EDIT_SPOT = 'spots/EDIT_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';


//! --------------------------------------------------------------------
//*                        Action Creators
//! --------------------------------------------------------------------

export const setAllSpots = (spots) => ({
  type: SET_ALL_SPOTS,
  payload: spots,
});

export const getSpot = (userSpot) => ({
  type: SET_SPOT,
  payload: userSpot,
});

export const createSpot = (newSpot) => ({
  type: CREATE_SPOT,
  payload: newSpot,
});

export const editSpot = (updatedSpot) => ({
  type: EDIT_SPOT,
  payload: updatedSpot,
});

export const deleteSpot = (deletedSpot) => ({
  type: DELETE_SPOT,
  payload: deletedSpot,
});

//! --------------------------------------------------------------------
//*                          Thunks
//! --------------------------------------------------------------------

// Fetch all spots
export const setAllSpotsThunks = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    dispatch(setAllSpots(data.Spots));
  }
};

// Get a single spot
export const getAspotThunk = (spotDataId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotDataId}`);
    if (response.ok) {
      const userSpot = await response.json();
      dispatch(getSpot(userSpot));
      return userSpot;
    }
  } catch (err) {
    console.error("Error fetching a spot:", err);
  }
};

// Create a new spot
export const createASpotThunk = (spotData) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(createSpot(newSpot));
    dispatch(setAllSpotsThunks()); // Optionally re-fetch all spots
    return newSpot;
  } else {
    const errors = await response.json();
    return errors;
  }
};

// Edit a spot
export const updateASpotThunk = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotData.id}`, {
      method: 'PUT', // Changed method to PUT for updates
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spotData),
    });
    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(editSpot(updatedSpot));
      return updatedSpot;
    }
  } catch (err) {
    console.error("Error updating a spot:", err);
  }
};

// Delete a spot
export const deleteASpotThunk = (spotDataId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotDataId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      dispatch(deleteSpot({ id: spotDataId }));
    }
  } catch (err) {
    console.error("Error deleting a spot:", err);
  }
};

//! --------------------------------------------------------------------
//*                          Reducer
//! --------------------------------------------------------------------
const initialState = {
  spots: [],
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_SPOTS:
      return { ...state, spots: action.payload };

    case SET_SPOT:
      return { ...state, spots: [action.payload] };

    case CREATE_SPOT:
      return { ...state, spots: [action.payload, ...state.spots] };

    case EDIT_SPOT:
      return {
        ...state,
        spots: state.spots.map((spot) =>
          spot.id === action.payload.id ? action.payload : spot
        ),
      };

    case DELETE_SPOT:
      return {
        ...state,
        spots: state.spots.filter((spot) => spot.id !== action.payload.id),
      };

    default:
      return state;
  }
};

export default spotsReducer;
