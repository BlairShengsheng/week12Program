const express = require('express');

const{ Op } = require('sequelize');
const router = express.Router();
const { Spots,bookings, SpotImages,reviewImages,reviews,User,sequelize} = require('../../db/models');


//GET/spots - Fetch all the spots
router.get('/',async(req, res) => {
  try {
    const spots = await Spots.findAll();
    res.status(200).json(spots);

  }catch(error){
    console.error(error);
    res.status(500).json({message: "An error occurred while fetching spots."})
  }
  
});

//GET/spots/spotId - Fetch the spot by its own ID
router.get('/:spotId',async(req, res) => {
  const { spotId } = req.params; // Get spotId from the request parameter
  try {
    const spot = await Spots.findOne({
      where:{ id: spotId },// Use the correct id field for querying
      include: [// Optionally include associated models
        {model: reviews, as: 'reviews'},
        {model: bookings, as: 'bookings'},
        {model: SpotImages, as: 'SpotImages'},
        {model: User, as: 'User', attributes: ['id', 'firstName','lastName']}
      ]
    });
    res.status(200).json(spot);

    // if the spot does not exist 
    if(!spot){
      return res.status(404).json({message: 'There is no such a Spot.'})
    }

  }catch(error){
    console.error(error);
    res.status(500).json({message: "An error occurred while fetching the spot."})
  }
  
});

//GET/spots/current - Fetch all spots owned by current user // we can change seeder file retest it
router.get('/current', async(req, res) => {
   // Assuming you have a way to get the logged-in user's ID from the request.
  // For example, you might be using a session or JWT authentication, where the user ID is stored in `req.user.id`.
  const { user } = req;// Assuming user information is available in req.user (from middleware)

  try{
    const spots = await Spots.findAll({
      where: {ownerId:user.id}, // Filter spots by the logged-in user's ID
      // include: [
      //   {model: reviews, as: 'reviews'},
      //   {model: bookings, as: 'bookings'},
      //   {model: SpotImages, as: 'SpotImages'}
      // ]
    })
    res.status(200).json(spots);
  }catch(error){
    console.error(error);
    res.status(500).json({message:"An error occurred while fetching the spot."})
  }
})




//POST/spots - Create a new spot
router.post('/', async(req, res) => {
  const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body;

  //Input validation
  if(!ownerId || !address || !city || !state || !country || lat === undefined || lng === undefined){
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try{
    const newSpot = await Spots.create({
      ownerId, address, city, state, country, lat, lng, name, description, price
    });
    res.status(200).json(newSpot);
  }catch(error){
    console.error(error);
    res.status(500).json({message: "An error occurred while creating the spot."});
  }

});

//POST/spots/:spotId/images -- add an image to a spot
router.post('/:spotId/images', async(req, res) => {
  const { spotId } = req.params;
  const {url, preview} = req.body;
  try {
    //check if the spot exists
    const spot = await Spots.findByPk(spotId);
    if(!spot){
      return res.status(404).json({message: "Spot couldn't be found"})
    }

    //create the new SpotImage
    const newImage = await SpotImages.create({
      spotId, 
      url,
      preview
    })
    res.status(200).json({message:"Image successfully added!"})

  }catch(error){
    console.error(error);
    res.status(500).json({message:"An error occurred while adding an image to the spot."})
  }
});

//PUT/spots/:spotId -- Edit a spot
router.put('/:spotId',async(req, res) => {
  const { spotId } = req.params;
  const { name, address, city, state, country, lat, lng, description, price } = req.body;

  try{
    const spot = await Spots.findByPk(spotId);

    //check if the spot exist
    if(!spot) {
      return res.status(404).json({message: "Spot couldn't be found."})
    }

    // Validate input fields
    const errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (lat === undefined || lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
    if (lng === undefined || lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
    if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price || price <= 0) errors.price = "Price per day must be a positive number";

    // If there are validation errors, return 400 error
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    // Update the spot with new values ,spot.name = "New Spot Name" || "Old Spot Name"; 
    spot.address = address || spot.address;
    spot.city = city || spot.city;
    spot.state = state || spot.state;
    spot.country = country || spot.country;
    spot.lat = lat || spot.lat;
    spot.lng = lng || spot.lng;
    spot.name = name || spot.name;
    spot.description = description || spot.description;
    spot.price = price || spot.price;

    // Save the updated spot to the database
    await spot.save();

    // Return the updated spot
    return res.status(200).json(spot);


  }catch(error){
    console.error(error);
    return res.status(500).json({ message: "An error occurred while updating the spot." });
  }
});


//DELETE/spots/:spotId -- delete a spot by its own Id
router.delete('/:spotId', async(req, res) => {
  const { spotId } = req.params;

  try{
    const spot = await Spots.findByPk(spotId);
    //check if the spot exist
    if(!spot){
      return res.status(404).json({message: "Spot couldn't be found!"})
    }

    await spot.destroy();
    return res.status(200).json({ message: 'Spot successfully deleted.' });

  }catch(error){
    console.log(error);
    res.status(500).json({message:" An error occurred while deleting the spot."})
  }
});



//GET/spots/:spotId/reviews -- Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async(req, res) => {
  const { spotId } = req.params;
  try{
    //check if the spot exist
    const spot = await Spots.findByPk(spotId);
    if(!spot){
      return res.status(404).json({message: "Spot couldn't be found."})
    }


    const theReviews = await reviews.findAll({
      where:{ spotId },
      include: [
        {
          model: User,
          attributes: ['id','username']
        },
        {
          model: reviewImages,
          attributes: ['id', 'url']
        }
      ]
    });
    return res.status(200).json(theReviews);
  }catch(error){
    console.error(error);
    return res.status(500).json({message: "An error occurred while retrieving the reviews of this spot."})
  }
});

//POST/spots/:spotId/reviews -- Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', async(req, res) => {
  const {spotId} = req.params;
  const {userId, review, stars } = req.body;

  try{
    //check if the spot exit
    const spot = await Spots.findByPk(spotId);
    if(!spot){
      return res.status(404).json({message:"Spot couldn't be found."})
    }

    // Validate input fields
    const errors = {};
    
    if(!review) errors.review = "Review text is required";
    if(stars === undefined || stars > 5.0 || stars < 1.0) errors.review = " Stars must be an integer from 1 to 5 ";

    // If there are validation errors, return 400 error
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Bad Request", errors });
    }
    

    //create the review 
    const newReview = await reviews.create({
      spotId,
      userId,
      review,
      stars
    });
    return res.status(200).json(newReview);
  }catch(error){
    console.error(error);
    return res.status(500).json({message: "User already has a review for this spot"})
  }
});

//GET/spots/:spotId/bookings -- Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', async(req, res) => {
  const { spotId } = req.params;
  //const currentUserId = req.user.id;
  
  try{
    //check if the spot exist
    const spot = await Spots.findByPk(spotId);
    if(!spot) return res.status(404).json({message: "Spot couldn't be found"});

    const allBookings = await bookings.findAll({
      where:{spotId},
      include: [
        {
          model: User,
          attributes: ['id', 'username','email']
        }
      ]
    });
    return res.status(200).json({bookings:allBookings});

  }catch(error){
    console.error(error);
    return res.status(500).json({message: "An error occurred while retrieving bookings data by spotId"});
  }

});

//POST/spots/:spotId/bookings -- Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', async(req, res) => {
  const {spotId } = req.params;
  const userId = req.user.id; // get the currenxt user'sID from authentication
  const {startDate, endDate } = req.body;

  try{
    //check if the spot exist
    const spot = await Spots.findByPk(spotId);
    if(!spot) return res.status(404).json({message: "Spot couldn't be found."});

    //Ensure the spot does Not belong to  the current user
    if(spot.ownerId === userId){
      return res.status(403).json({message: "You can not book your own spot"});
    };
    //validate the startDate and endDate
    const today = new Date().toISOString().split('T')[0];
    if(new Date(startDate) < new Date(today)){

      return res.status(400).json({
        message: "Bad Request",
        errors: {
          startDate: "startDate cannot be in the past"
        }
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot be on or before startDate"
        }
      });
    }

     // Check for booking conflicts
     const conflictingBookings = await bookings.findOne({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            startDate: {
              [Op.lte]: startDate
            },
            endDate: {
              [Op.gte]: endDate
            }
          }
        ]
      }
    });

    if (conflictingBookings) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      });
    }


    const newBooking = await bookings.create({
      spotId, userId, startDate, endDate });
  
    return res.status(200).json(newBooking);
  }catch(error){
    console.error(error);
    return res.status(500).json({message: "An error occurred while creating bookings data by spotId"});
  }
})

module.exports = router;
