import { nogizakaNames } from '../utils/constants';

function relatesToNogizaka(text: string) {
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
