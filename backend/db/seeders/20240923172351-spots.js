'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spots } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {

   await Spots.bulkCreate([
    {
    "ownerId": 1,
    "address": "556 Tracy Street",
    "city": "Spring Valley",
    "state": "California",
    "country":"United States",
    "lat":88.7645358,
    "lng":-122.4730329,
    "name":"Elegant Luxury! Cabin Sleep 19",
    "description":"Adventure meets luxury with this one of a kind climate controlled glamping excursion. All the best of nature combined with the luxury of an upscale hotel room. Gaze up at the stars or out at the rolling Eureka forestry from the comfort of your 100% climate controlled dome. Soak in the jetted tub cookout on the deck and drink cocktails from the built in hammock. 15min to Spring Valley downtown. NO WIFI and cell service is spotty.",
    "price": 200
   },
   {
    "ownerId": 2,
    "address": "997 Caleb Steven Street",
    "city": "Fall Valley",
    "state": "Washington DC",
    "country":"United States",
    "lat":99.7645358,
    "lng":-111.4730329,
    "name":"Warm Cozy! Cabin Sleep 20",
    "description":"Nestled beneath towering redwoods, Caz Cabin is a beautifully remodeled retreat. Serene alfresco meals on the decks or skip stones in the backyard creek. Inside, cozy up to the wood fire and get comfy. Custom design and thoughtful details promise an unforgettable stay and your connection to all Sonoma has to offer. Escape the city! Insta - CazCabinProject",
    "price": 100

   },
   {
    "ownerId": 3,
    "address": "345 Ave",
    "city": "Cazadero",
    "state": "California",
    "country":"United States",
    "lat":26.7645358,
    "lng":-112.4730329,
    "name":"Elegant Luxury! Cabin Sleep 19",
    "description":"The Cobb Haus is located at the end of a quiet dirt road of a rural neighborhood. (Please note: there are neighbors, however the cabin is situated in a way that it faces out into the forest making it feel private and secluded when inside. The deck however, can be seen by the neighbor). It is nestled in the dogwood trees with a beautiful deck (and an outdoor shower!). It offers one large open common space as well as a bedroom and living room with amazing tree views - it feels like you're in a treehouse! ",
    "price": 329
   },
   {
    "ownerId": 3,
    "address": "326 Cobber Rd",
    "city": "Winter Vally",
    "state": "New York",
    "country":"United States",
    "lat":77.7645358,
    "lng":-102.4730329,
    "name":"Romantic Luxury! Cabin Sleep 33",
    "description":"This rustic yet luxurious cabin is the perfect place to unplug. Walk through the woods, relax by a fire, and enjoy the food and wine of the Russian River Valley. 10 minutes from the beach. Minutes from Occidental, Graton, Forestville, and Guerneville. House has a full bathroom, bedroom downstairs with a Cal King bed and one upstairs with two twin beds.5 acres in the redwoods, trampoline, fire pit area, high-speed Internet.",
    "price": 500
   },
   {
    "ownerId": 1,
    "address": "693 groveland Street",
    "city": "Groveland",
    "state": "Colorado",
    "country":"United States",
    "lat":98.7645358,
    "lng":-322.4730329,
    "name":"Guest Favorite! Cabin Sleep 39",
    "description":"A rustic chalet cabin on a quiet cul-de-sac. Great little getaway cabin for those who want to escape the craziness of a big city. The home is perfect for a small group of up to 5 (max) including kids.About 25 miles to Yosemite National Park entrance.",
    "price": 237
   }

   
  ],{validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1,2,3,4,5] }
    }, {});
  }
};
