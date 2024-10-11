import { useState } from "react";
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import './LoginForm.css';

export default function LoginFormPage() {
  const dispatch = useDispatch(); // hook to dispatch actons
  const sessionUser = useSelector((state) => state.session.user);// Get the session user from Redux state
  const [credential, setCredential] = useState("")// state for username or email
  const [password, setPassword] = useState("") // state for password
  const [errors, setErrors] = useState({}) //state for errors


  //if logged in, redirect to home
  if(sessionUser) return <Navigate to='/' replace={true} />;

  //Handle form submission
  const handleSubmit  = (e) => {
    e.preventDefault();
    setErrors({}); // clear errors before submission

    // Dispatch login action with form values
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) =>  {

        const data = await res.json();
        if(data?.errors) setErrors(data.errors);// Set error state if response contains errors
    });
  };

  return (
    <>
    <h1>Log In</h1>
    <form onSubmit={handleSubmit}>
      <label>
        Username or Email
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)} // Update state on change
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update state on change
          required
        />
      </label>
      {errors.credential && <p>{errors.credential}</p>}  {/* Display errors if any */}
      <button type="submit">Log In</button>
    </form>
  </>

  );
}
