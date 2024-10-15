
import { csrfFetch } from "./csrf";

//! --------------------------------------------------------------------
//*                        Regular Action type
//! --------------------------------------------------------------------
const GET_SPOT = 'spots/GET_SPOT';
const EDIT_SPOT = 'spots/EDIT_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';


//! --------------------------------------------------------------------
//*                        Regular Action Creators
//! -------------------------------------------------------------------- 

export const getSpot = (userSpot) => ({
    type: GET_SPOT,
    payload: userSpot
});

export const editSpot = (updatedSpot) => ({
  type: EDIT_SPOT,
  payload: updatedSpot
});

export const createSpot = (newSpot) => ({
  type: CREATE_SPOT,
  payoad: newSpot
});

export const deleteSpot = (theSpot) => ({
  type: DELETE_SPOT,
  payload: theSpot
})

//! --------------------------------------------------------------------
//*                          Thunks
//! --------------------------------------------------------------------
