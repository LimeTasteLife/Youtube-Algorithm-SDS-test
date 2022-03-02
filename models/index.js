const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const UserData = require('./userData');

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.UserData = UserData;

User.init(sequelize);
UserData.init(sequelize);

User.associate(db);
UserData.associate(db);

module.exports = db;
