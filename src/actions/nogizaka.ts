import { nogizakaNames } from '../utils/constants';

export const relatesToNogizaka = (text: string): boolean => {
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
};
