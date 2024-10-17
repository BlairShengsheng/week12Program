import './CreateASpot.css';
import { useState, useEffect } from 'react';
// import { useDispatch,useSelector } from 'react-redux';
import { createASpot } from '../../store/userSpots';


//! --------------------------------------------------------------------
//*                          CreateSpots Component
//! --------------------------------------------------------------------
export function CreateASpot() {
  // const userId = useSelector((state) => state.session.user.id);

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [imagesURL, setImagesURL] = useState("");
  const [preImageURL, setPreImageURL] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [title, setTitle] =useState("")

  //validation state
  const [errors, setErrors] = useState({});//errors is an object initialized with empty state {}
  const [hasSubmitted, setHasSubmitted] = useState(false);

  //! --------------------------------------------------------------------
  //                          Handle Form Submit
  //! --------------------------------------------------------------------

  useEffect(() => {
    const validationErrors = {};

      //validate all fields
      if(!country) validationErrors.country = "Country is required";
      if(!address) validationErrors.address = "Address is required";
      if(!city) validationErrors.city = "City is required";
      if(!state) validationErrors.state = "State is required";
      if(!description || description.length < 30) validationErrors.  description = "Description needs a minimum of 30 characters"
      if(!title) validationErrors.title = "Name is required";
      if(!price || price <= 0) validationErrors.price = "Price is required";
      if(!imagesURL || !imagesURL.match(/\.(png|jpg|jpeg)$/i)) validationErrors.imagesURL = "Image URL must end in .png, .jpg, or .jpeg";
      if(!preImageURL || !preImageURL.match(/\.(png|jpg|jpeg)$/i)) validationErrors.preImageURL="Preview image is required"
    

      setErrors(validationErrors);//update errors state

  },[country, address, city, state, description, title, price, imagesURL, preImageURL]);



  

  const handleSubmit = (e) => {
    e.preventDefault();// prevents the page from refreshing or navigating away, and allows you to handle the form submission via JavaScript.


    setHasSubmitted(true);

    //check the validationErrors object is empty or not, if it's empty means there is no errors
    if (Object.keys(errors).length === 0){
      console.log("Form is ready to be submitted");

            // Reset the form
            setCountry("");
            setAddress("");
            setCity("");
            setState("");
            setPrice("");
            setTitle("");
            setDescription("");
            setImagesURL("");
            setPreImageURL("");
            setHasSubmitted(false); // Reset form state
    }

  }





//! --------------------------------------------------------------------
//                         Return JSX HTML Part
//! --------------------------------------------------------------------
  return (
    <div className="form-container">
      <h1>Create A New Spot</h1>
      <h2>Where&apos;s your place located?</h2>
      <h4>Guests will only get your exact address once they&apos;ve booked a reservation</h4>

      <form onSubmit={handleSubmit}>
        <label>Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          required
        />
         {hasSubmitted && errors.country && <p className="error-message">{errors.country}</p>}


        <label>Street Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          required
        />
        {hasSubmitted && errors.address && <p className="error-message">{errors.address}</p>}

        <div className="city-state-container">
          <div className="input-group">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              required
            />
            {hasSubmitted && errors.city && <p className="error-message">{errors.city}</p>}
          </div>

          <div className="input-group">
            <label>State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="STATE"
              required
            />
            {hasSubmitted && errors.state && <p className="error-message">{errors.state}</p>}
          </div>
        </div>

        <br />

        <div className="description-container">
          <h2>Describe your place to guests</h2>
          <h4>Mention the best features of your space, any special amenities like fast wifi or parking&lsquo; and what you love about the neighborhood.</h4>

          <textarea id="description-area" 
          placeholder="Please write at least 30 characters" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}></textarea>

          {hasSubmitted && errors.description && <p className="error-message">{errors.description}</p>}
        </div>

        <br />

        <div className="title-container">
          <h2>Create a title for your spot</h2>
          <h4>Catch guests&apos; attention with a spot title that highlights what makes your place special.</h4>

          <textarea id="title-area" 
          placeholder="Name of your spot" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}></textarea>

          {hasSubmitted && errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <br />

        <div className="price-container">
          <h2>Set a base price for your spot</h2>
          <h4>Competitive pricing can help your listing stand out and rank higher in search results.</h4>

          $<textarea id="price-area" 
          placeholder="Price per night (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}></textarea>

          {hasSubmitted && errors.price && <p className="error-message">{errors.price}</p>}
        </div>

        <br />

        <div className="photo-container">
          <h2>Live up your spot with photos</h2>
          <h4>Submit a link to at least one photo to publish your spot</h4>

          <textarea id="image-url-area" 
          placeholder="Preview Image URL" 
          value={imagesURL}
          onChange={(e) => setPreImageURL(e.target.value)}></textarea>

          {hasSubmitted && errors.preImageURL && <p className="error-message">{errors.preImageURL}</p>}

          <textarea id="image-url-area" 
          placeholder="Image URL" 
          value={imagesURL}
          onChange={(e) => setImagesURL(e.target.value)}></textarea>

          {hasSubmitted && errors.imagesURL && <p className="error-message">{errors.imagesURL}</p>}

          <textarea id="image-url-area" 
          placeholder="Image URL" 
          value={imagesURL}
          onChange={(e) => setImagesURL(e.target.value)}></textarea>

          {hasSubmitted && errors.imagesURL && <p className="error-message">{errors.imagesURL}</p>}
          

          <textarea id="image-url-area" 
          placeholder="Image URL" 
          value={imagesURL}
          onChange={(e) => setImagesURL(e.target.value)}></textarea>

          {hasSubmitted && errors.imagesURL && <p className="error-message">{errors.imagesURL}</p>}

          
        </div>
      
       <button id="create-spot-button"type='submit'>Create Spot</button>
    
 
        
      </form>
      <br />





      
    </div>
  );
}
