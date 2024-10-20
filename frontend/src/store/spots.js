import { csrfFetch } from "./csrf";

const imageFilenames = [
  'previewImage1.jpg',
  'previewImage2.jpg',
  'previewImage3.jpg',
  'previewImage4.jpg',
  'previewImage5.jpg',
  // Add all your image filenames here
];

//! --------------------------------------------------------------------
//*                        Action Types
//! --------------------------------------------------------------------
const SET_ALL_SPOTS = "spots/SET_ALL_SPOTS";
const SET_SPOT = "spots/SET_SPOT";
const CREATE_SPOT = "spots/CREATE_SPOT";
const EDIT_SPOT = "spots/EDIT_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";

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
// export const setAllSpotsThunks = () => async (dispatch) => {
//   const response = await csrfFetch("/api/spots");
//   if (response.ok) {
//     const data = await response.json();
//     dispatch(setAllSpots(data.Spots));// backend data Spots, go to localhost:.../api/spots in your browser 
//   }
// };


export const setAllSpotsThunks = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const data = await response.json();
    const spotsWithImages = data.Spots.map((spot, index) => ({
      ...spot,
      previewImage: imageFilenames[index % imageFilenames.length],
      smallImages: [
        imageFilenames[(index + 1) % imageFilenames.length],
        imageFilenames[(index + 2) % imageFilenames.length],
        imageFilenames[(index + 3) % imageFilenames.length],
        imageFilenames[(index + 4) % imageFilenames.length],
      ]
    }));
    dispatch(setAllSpots(spotsWithImages));
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
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(createSpot(newSpot));
    dispatch(setAllSpotsThunks()); // re-fetch all spots, maintaining consistency with the backend
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
      method: "PUT", // Changed method to PUT for updates
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spotData),
    });
    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(editSpot(updatedSpot));
      dispatch(setAllSpotsThunks()); // Re-fetch all spots after updating, maintaining consistency with the backend(also updating the backend)
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
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(deleteSpot(spotDataId));
      dispatch(setAllSpotsThunks()); // Re-fetch after deleting
    }
  } catch (err) {
    console.error("Error deleting a spot:", err);
  }
};

//! --------------------------------------------------------------------
//*                          Reducer
//! --------------------------------------------------------------------
const initialState = {
  allSpots: {},
  singleSpot: {},
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_SPOTS: {
      const newState = { ...state, allSpots: { ...state.allSpots } };
      action.payload.forEach((spot) => {
        //payload
        newState.allSpots[spot.id] = spot;
      });
      return newState;
    }

    case SET_SPOT: {
      return {
        ...state,
        singleSpot: action.payload,
      };
    }
    case CREATE_SPOT: {
      const newState = {
        ...state,
        allSpots: { ...state.allSpots, [action.payload.id]: action.payload },
        singleSpot: action.payload, // Optionally update singleSpot to the new spot
      };
      return newState;
    }

    case EDIT_SPOT: {
      const newState = { ...state };
      newState.allSpots[action.payload.id] = action.payload; // Update the spot in the state
      return newState;
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState.allSpots[action.payload]; // Remove the spot from the state
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
