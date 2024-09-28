'use strict';

const { bookings } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('bookings',[
    {
      spotId: 1,
      userId: 2,
      startDate: "2021-11-12",
      endDate: "2021-11-26"
    },
    {
      spotId: 2,
      userId: 1,
      startDate: "2022-10-12",
      endDate: "2022-10-26"
    },
    {
      spotId: 3,
      userId: 3,
      startDate: "2020-09-12",
      endDate: "2021-09-26"
    },
    {
      spotId: 2,
      userId: 3,
      startDate: "2020-06-12",
      endDate: "2021-06-26"
    },
    {
      spotId: 6,
      userId: 3,
      startDate: "2020-05-12",
      endDate: "2022-05-26"
    },
    {
      spotId: 5,
      userId: 4,
      startDate: "2020-04-12",
      endDate: "2022-04-26"
    },
    {
      spotId: 4,
      userId: 5,
      startDate: "2020-08-01",
      endDate: "2022-09-16"
    },
    {
      spotId: 7,
      userId: 19,
      startDate: "2020-07-12",
      endDate: "2023-08-06"
    },
    {
      spotId: 8,
      userId: 13,
      startDate: "2020-02-12",
      endDate: "2022-03-26"
    },
    {
      spotId: 9,
      userId: 11,
      startDate: "2020-08-12",
      endDate: "2022-04-26"
    },
  ]);
  },
  async down (queryInterface, Sequelize) {
    options.tableName = 'bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3,4,5,6,7,8,9] }
    }, {});
  }
};
