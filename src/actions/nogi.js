const { nogizakaNames } = require('../utils/constants');

function relatesToNogizaka(text) {
  for (const name of nogizakaNames) {
    if (text.includes(name)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  relatesToNogizaka,
};
