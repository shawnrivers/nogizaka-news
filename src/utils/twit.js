const Twit = require('twit');
const config = require('../config');

module.exports = {
  T: new Twit(config)
};
