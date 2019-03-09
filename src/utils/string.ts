import { HOURS } from './constants';

export const getStringLength = (text: string): number => {
  let length = 0;
  for (let i = 0; i < text.length; i++) {
    const characterCode = text.charCodeAt(i);
    if (
      (characterCode >= 0x0 && characterCode < 0x81) ||
      characterCode === 0xf8f0 ||
      (characterCode >= 0xff61 && characterCode < 0xffa0) ||
      (characterCode >= 0xf8f1 && characterCode < 0xf8f4)
    ) {
      length += 1;
    } else {
      length += 2;
    }
  }
  return length;
};

export const containsHour = (text: string): boolean => {
  for (const hour of HOURS.jp) {
    if (text.includes(hour)) {
      return true;
    }
  }
  for (const hour of HOURS.normal) {
    if (text.includes(hour)) {
      return true;
    }
  }
  for (const hour of HOURS.twoByte) {
    if (text.includes(hour)) {
      return true;
    }
  }
  return false;
};
