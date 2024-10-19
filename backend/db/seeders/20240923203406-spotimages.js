'use strict';

const { SpotImages } = require('../models');
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImages.bulkCreate([
      {
        spotId: 1,
        url: "/images/previewImage1.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: "/images/previewImage2.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: "/images/previewImage3.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4,
        url: "/images/previewImage4.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 5,
        url: "/images/previewImage5.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },



      {spotId:1, url: '/images/detail1.jpg', preview: false},
      {spotId:1, url: '/images/detail2.jpg', preview: false},
      {spotId:1, url: '/images/detail3.jpg', preview: false},
      {spotId:1, url: '/images/detail4.jpg', preview: false},

      {spotId:2, url: '/images/detail1.jpg', preview: false},
      {spotId:2, url: '/images/detail2.jpg', preview: false},
      {spotId:2, url: '/images/detail3.jpg', preview: false},
      {spotId:2, url: '/images/detail4.jpg', preview: false},

      {spotId:3, url: '/images/detail1.jpg', preview: false},
      {spotId:3, url: '/images/detail2.jpg', preview: false},
      {spotId:3, url: '/images/detail3.jpg', preview: false},
      {spotId:3, url: '/images/detail4.jpg', preview: false},

      {spotId:4, url: '/images/detail1.jpg', preview: false},
      {spotId:4, url: '/images/detail2.jpg', preview: false},
      {spotId:4, url: '/images/detail3.jpg', preview: false},
      {spotId:4, url: '/images/detail4.jpg', preview: false},

      {spotId:5, url: '/images/detail1.jpg', preview: false},
      {spotId:5, url: '/images/detail2.jpg', preview: false},
      {spotId:5, url: '/images/detail3.jpg', preview: false},
      {spotId:5, url: '/images/detail4.jpg', preview: false},





    ],{validate: true});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3,4,5] }
});
  }
};
