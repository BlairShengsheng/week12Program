'use strict';

/** @type {import('sequelize-cli').Migration} */

const { reviews } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {

  
  async up (queryInterface, Sequelize) {

   await reviews.bulkCreate([
    {
      userId: 1,
      spotId: 1,
      "review": "Great hideaway, super place to decompress and take in the nature.",
      "stars": 4.0
    },
    {
      userId: 2,
      spotId: 2,
      "review": "This is super cool and awsome!",
      "stars": 5.0
    },
    {
      userId: 3,
      spotId: 3,
      "review": "beautiful house and amazing view!",
      "stars": 5.0
    },
   ],{validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3,4,5] }
    }, {});
  }
};
