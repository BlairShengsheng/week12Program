'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      reviews.belongsTo(models.User, {foreignKey:"userId", onDelete: 'CASCADE'});
      reviews.belongsTo(models.Spots, {foreignKey: "spotId", onDelete: 'CASCADE'});
      reviews.hasMany(models.reviewImages, {foreignKey: "reviewId",as:"ReviewImages", onDelete: 'CASCADE'});
    }
  }
  reviews.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    spotId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    review: {
      type: DataTypes.STRING
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,  // Minimum star rating
        max: 5   // Maximum star rating
      }
    }
  }, {
    sequelize,
    modelName: 'reviews',
  });
  return reviews;
};
