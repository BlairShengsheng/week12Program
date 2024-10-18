import './CreateASpot';
import {useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllSpotsThunks, updateASpotThunk, getAspotThunk  } from '../../store/spots';

//! --------------------------------------------------------------------
//*                          EditSpots Component
//! --------------------------------------------------------------------
export function EditSpot() {
  const { spotId } = useParams();//------add this part
  const navigate = useNavigate();
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

  //validation state
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

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



   //! --------------------------------------------------------------------
  //                          Handle Form Submit
  //! --------------------------------------------------------------------



  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = {};

    // Validate all fields
    if (!country) validationErrors.country = "Country is required";
    if (!address) validationErrors.address = "Address is required";
    if (!city) validationErrors.city = "City is required";
    if (!state) validationErrors.state = "State is required";
    if (!description || description.length < 30) validationErrors.description = "Description needs a minimum of 30 characters";
    if (!title) validationErrors.title = "Name is required";
    if (!price || price <= 0) validationErrors.price = "Price is required";
    if (!lat || lat < -90 || lat > 90) validationErrors.lat = "Latitude must be between -90 and 90."; // Validation for lat
    if (!lng || lng < -180 || lng > 180) validationErrors.lng = "Longitude must be between -180 and 180."; // Validation for lng
    // if (!imagesURL || !imagesURL.match(/\.(png|jpg|jpeg)$/i)) validationErrors.imagesURL = "Image URL must end in .png, .jpg, or .jpeg";
    if (!preImageURL || !preImageURL.match(/\.(png|jpg|jpeg)$/i)) validationErrors.preImageURL = "Preview image is required";


    // Validate each URL in the imagesURL array
    imagesURL.forEach((url, index) => {
      if (!url.match(/\.(png|jpg|jpeg)$/i)) {
       validationErrors[`image${index}`] = `Image URL ${index + 1} must end in .png, .jpg, or .jpeg`;
      }
    })
  
    

    if(Object.keys(validationErrors).length > 0){
      setErrors(validationErrors); // Update errors state
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
      <h1>Update Your Spot</h1>
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




        <div className="city-state-container">
          <div className="input-group">
            <label>Latitude</label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Lat"
              required
            />
            {hasSubmitted && errors.city && <p className="error-message">{errors.lat}</p>}
          </div>

          <div className="input-group">
            <label>Longtitude</label>
            <input
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="Long"
              required
            />
            {hasSubmitted && errors.state && <p className="error-message">{errors.lng}</p>}
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

          $<textarea
            id="price-area"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></textarea>

          {hasSubmitted && errors.price && <p className="error-message">{errors.price}</p>}
        </div>

        <br />

        <div className="photo-container">
          <h2>Live up your spot with photos</h2>
          <h4>Submit a link to at least one photo to publish your spot</h4>

          <textarea
            id="image-url-area"
            placeholder="Preview Image URL"
            value={preImageURL}
            onChange={(e) => setPreImageURL(e.target.value)}
          ></textarea>

          {hasSubmitted && errors.preImageURL && <p className="error-message">{errors.preImageURL}</p>}

 
          <textarea
            id="image-url-area"
            placeholder="Image URL1"
            value={imagesURL[0]}  // Use index 0 for the first URL
            onChange={(e) => {
              const updatedImages = [...imagesURL];
              updatedImages[0] = e.target.value;
              setImagesURL(updatedImages);
            }}
          ></textarea>

          {hasSubmitted && errors.imagesURL && <p className="error-message">{errors.imagesURL}</p>}


          <textarea
            id="image-url-area"
            placeholder="Image URL2"
            value={imagesURL[1]}  // Use index 0 for the first URL
            onChange={(e) => {
              const updatedImages = [...imagesURL];
              updatedImages[1] = e.target.value;
              setImagesURL(updatedImages);
            }}
          ></textarea>

          {hasSubmitted && errors.imagesURL && <p className="error-message">{errors.imagesURL}</p>}


          <textarea
            id="image-url-area"
            placeholder="Image URL3"
            value={imagesURL[2]}  // Use index 0 for the first URL
            onChange={(e) => {
              const updatedImages = [...imagesURL];
              updatedImages[2] = e.target.value;
              setImagesURL(updatedImages);
            }}
          ></textarea>

          {hasSubmitted && errors.imagesURL && <p className="error-message">{errors.imagesURL}</p>}


          <textarea
            id="image-url-area"
            placeholder="Image URL4"
            value={imagesURL[3]}  // Use index 0 for the first URL
            onChange={(e) => {
              const updatedImages = [...imagesURL];
              updatedImages[3] = e.target.value;
              setImagesURL(updatedImages);
            }}
          ></textarea>

          {hasSubmitted && errors.imagesURL && <p className="error-message">{errors.imagesURL}</p>}
        </div>

        <button id="create-spot-button" type="submit">
          Update Spot
        </button>
      </form>
      <br />
    </div>
  );

}
