import { csrfFetch } from "./csrf";

//! --------------------------------------------------------------------
//*                        Regular Action type
//! --------------------------------------------------------------------
const SET_ALL_SPOTS = 'spots/setAllSpots'



//! --------------------------------------------------------------------
//*                        Regular Action Creators
//! --------------------------------------------------------------------

export const setAllSpots = (spots) => ({
  type: SET_ALL_SPOTS,
  payload: spots
});



//! --------------------------------------------------------------------
//*                          Thunks
//! --------------------------------------------------------------------


//All Spots
export const setAllSpotsThunks = () => async(dispatch) => {
  const response = await csrfFetch('/api/spots');

  if(response.ok){
    const data = await response.json();
    dispatch(setAllSpots(data.Spots))
  };
  return response;
}


//! --------------------------------------------------------------------
//*                          Reducer
//! --------------------------------------------------------------------

const initialState = {
  spots: []
}

const spotsReducer = (state = initialState, action) => {

  let newState;
  switch(action.type) {
    
    case SET_ALL_SPOTS:
      newState = {...state};
      newState["spots"] = action.payload;
      return newState;


    
    default: 
      return state;
  };

};

export default spotsReducer;
