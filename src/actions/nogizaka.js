const { nogizakaNames } = require('../utils/constants');

function relatesToNogizaka(text) {
  if (text !== undefined) {
    for (const name of nogizakaNames) {
      if (text.includes(name)) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
}

module.exports = {
  relatesToNogizaka,
};
