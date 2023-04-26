'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    pictures: DataTypes.STRING,
    isgoogleauth: DataTypes.BOOLEAN,
    isfacebookauth: DataTypes.BOOLEAN,
    access_token: DataTypes.TEXT,
    refresh_token: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};