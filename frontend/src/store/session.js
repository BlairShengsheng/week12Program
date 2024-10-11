
import { csrfFetch } from "./csrf";



//! --------------------------------------------------------------------
//*                        Regular Action type
//! --------------------------------------------------------------------
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';


//! --------------------------------------------------------------------
//*                        Regular Action Creators
//! --------------------------------------------------------------------
export const setUser = (user) => ({
  type: SET_USER,
  payload:  user,
});

export const removeUser = () => ({
  type: REMOVE_USER,
});

//! --------------------------------------------------------------------
//*                       Thunks action creator
//! --------------------------------------------------------------------
export const login = (credential, password) => async (dispatch) => {
  //make teh POST request to log in the user
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({ credential, password }),
  });

  //Parse the JSON response
  if(response.ok){
    const data = await response.json();

    dispatch(setUser(data.user))
    return response;
  }

}

// test it out with this -> window.store.dispatch(window.sessionActions.login('demo@user.io', 'password')); in your browser console to see if it works


//! --------------------------------------------------------------------
//*                        Reducer
//! --------------------------------------------------------------------


// Initial State
const initialState = {
  user: null,
}

export default function sessionReducer(state = initialState, action) {
  switch ( action.type) {

    case SET_USER:
      return {...state, user: action.payload};
    
    case REMOVE_USER:
      return { ...state, user: null };
    
    default:
      return state;      
  }
}
