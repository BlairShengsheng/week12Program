import './CreateASpot';
import {useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllSpotsThunks, updateASpotThunk, getAspotThunk  } from '../../store/spots';

//! --------------------------------------------------------------------
//*                          CreateSpots Component
//! --------------------------------------------------------------------
export function EditSpot() {
  const { spotId } = useParams();//------add this part
  const navigate = useNavigate(); // Initialize navigate
  const dispatch = useDispatch();

  const spot = useSelector(state => state.allSpots.singleSpot);//------add this part
  // console.log('Single Spot Data:', spot);

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [imagesURL, setImagesURL] = useState(["","","",""]);
  const [preImageURL, setPreImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [lat, setLat] = useState(""); // Added latitude field
  const [lng, setLng] = useState(""); // Added longitude field

  // Validation state
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

 

  //! --------------------------------------------------------------------
  //                          Handle Form Submit
  //! --------------------------------------------------------------------

  useEffect(() => {
    dispatch(getAspotThunk(spotId))
  },[dispatch, spotId])

  useEffect(() => {
    if (spot) {
      setCountry(spot.country || "");
      setAddress(spot.address || "");
      setCity(spot.city || "");
      setState(spot.state || "");
      setDescription(spot.description || "");
      setPrice(spot.price || "");
      setTitle(spot.name || "");
      setLat(spot.lat || "");
      setLng(spot.lng || "");
      setPreImageURL(spot.previewImage || "");
      setImagesURL(spot.images || ["","","",""]);
    }
  }, [spot]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = {};

    // Validate all fields
    if (!country.trim()) validationErrors.country = "Country is required";
    if (!address.trim()) validationErrors.address = "Address is required";
    if (!city.trim()) validationErrors.city = "City is required";
    if (!state.trim()) validationErrors.state = "State is required";
    if (!description.trim()) validationErrors.description = "Description is required";
    else if (description.length < 30) validationErrors.description = "Description needs 30 or more characters";
    if (!title.trim()) validationErrors.title = "Name is required";
    if (!price) validationErrors.price = "Price per night is required";
    if (!lat) validationErrors.lat = "Latitude is required";
    else if (isNaN(lat) ||lat < -90 || lat > 90) validationErrors.lat = "Latitude must be between -90 and 90";
    if (!lng) validationErrors.lng = "Longitude is required";
    else if (isNaN(lng) ||lng < -180 || lng > 180) validationErrors.lng = "Longitude must be between -180 and 180";
    
    if (!preImageURL) validationErrors.preImageURL = "Preview Image URL is required";
    else if (!preImageURL.match(/\.(png|jpg|jpeg)$/i)) {
      validationErrors.preImageURL = "Image URL must end in .png, .jpg, or .jpeg";
    }

    
    imagesURL.forEach((url, index) => {
      // Only validate empty image URLs
      if(!url){validationErrors[`image${index}`] = "Detail Image is required";}

      // Only validate non-empty image URLs
      if (url && !url.match(/\.(png|jpg|jpeg)$/i)) {
        validationErrors[`image${index}`] = "Image URL must end in .png, .jpg, or .jpeg";
      }
    });

    setErrors(validationErrors); // Update errors state


  
    

    if(Object.keys(validationErrors).length > 0){
      return;
    }


    // let name = title
    const spotData = {
      id: spotId,
      country,
      address,
      city,
      state,
      imagesURL,
      preImageURL,
      description,
      price,
      name: title,
      lat,
      lng,
    }


    const updatedSpot = await dispatch(updateASpotThunk (spotData));
    if(updatedSpot && updatedSpot.id) {
      // await dispatch(setAllSpotsThunks());
      navigate(`/spots/${updatedSpot.id}`)
      await dispatch(setAllSpotsThunks());
    }

  
    
  };
  

  //! --------------------------------------------------------------------
  //                         Return JSX HTML Part
  //! --------------------------------------------------------------------
  return (
    <div className="form-container">


      <form onSubmit={handleSubmit}>
        <h1>Create A New Spot</h1>

        {hasSubmitted && Object.keys(errors).length > 0 && (
          <div className="error-summary">
            {Object.values(errors).map((error, index) => (
              <p key={index} className="error-message">{error}</p>
            ))}
          </div>
        )}



        <h2>Where&apos;s your place located?</h2>
        <h4>Guests will only get your exact address once they&apos;ve booked a reservation</h4>

        <label>Country
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          className={hasSubmitted && errors.country ? 'error' : ''}
        />
        {hasSubmitted && errors.country && <p className="error-message">{errors.country}</p>}
        </label>

        <label>Street Address
         <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className={hasSubmitted && errors.address ? 'error' : ''}
         />
         {hasSubmitted && errors.address && <p className="error-message">{errors.address}</p>}
        </label>

        <div className="city-state-container">
          <div className="input-group">
            <label>City
             <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className={hasSubmitted && errors.city ? 'error' : ''}
             />
             {hasSubmitted && errors.city && <p className="error-message">{errors.city}</p>}
            </label>
          </div>

          <div className="input-group">
            <label>State
             <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="STATE"
              className={hasSubmitted && errors.state ? 'error' : ''}
             />
             {hasSubmitted && errors.state && <p className="error-message">{errors.state}</p>}
            </label>
          </div>
        </div>




        <div className="city-state-container">
          <div className="input-group">
           <label>Latitude
             <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Lat"
              className={hasSubmitted && errors.lat ? 'error' : ''}
             />
             {hasSubmitted && errors.city && <p className="error-message">{errors.lat}</p>}
            </label>
          </div>

          <div className="input-group">
            <label>Longtitude
             <input
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="Lng"
              className={hasSubmitted && errors.lng ? 'error' : ''}
             />
             {hasSubmitted && errors.state && <p className="error-message">{errors.lng}</p>}
            </label>
          </div>
        </div>





        <br />

        <div className="description-container">
          <h2>Describe your place to guests</h2>
          <h4>Mention the best features of your space, any special amenities like fast wifi or parking‘ and what you love about the neighborhood.</h4>

          <textarea
            id="description-area"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          {hasSubmitted && errors.description && <p className="error-message">{errors.description}</p>}
        </div>

        <br />

        <div className="title-container">
          <h2>Create a title for your spot</h2>
          <h4>Catch guests&apos; attention with a spot title that highlights what makes your place special.</h4>

          <textarea
            id="title-area"
            placeholder="Name of your spot"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></textarea>

          {hasSubmitted && errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <br />

        <div className="price-container">
          <h2>Set a base price for your spot</h2>
          <h4>Competitive pricing can help your listing stand out and rank higher in search results.</h4>

          <div className="money">
            <span className="dollar-sign">$</span>
            <textarea
              id="price-area"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></textarea>
          </div>

          {hasSubmitted && errors.price && <p className="error-message">{errors.price}</p>}
        </div>

        <br />

        <div className="photo-container">
          <h2>Liven up your spot with photos</h2>
          <h4>Submit a link to at least one photo to publish your spot</h4>

          <label>
            Preview Image URL
            <input
              type="text"
              value={preImageURL}
              onChange={(e) => setPreImageURL(e.target.value)}
              placeholder="Preview Image URL"
            />
            {hasSubmitted && errors.preImageURL && <p className="error-message">{errors.preImageURL}</p>}
          </label>

          {imagesURL.map((url, index) => (
            <label key={index}>
              Image URL {index + 1}
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  const updatedImages = [...imagesURL];
                  updatedImages[index] = e.target.value;
                  setImagesURL(updatedImages);
                }}
                placeholder={`Image URL ${index + 1}`}
              />
              {hasSubmitted && errors[`image${index}`] && <p className="error-message">{errors[`image${index}`]}</p>}
            </label>
          ))}
        </div>

        <button id="create-spot-button" type="submit">
          Update Spot
        </button>
      </form>
      <br />
    </div>
  );
}
