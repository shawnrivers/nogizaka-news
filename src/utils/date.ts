export type IDate = {
  year: string;
  month: string;
  day: string;
};

export const getToday = (): IDate => {
  const now = new Date();
  const tokyoDate = now.toLocaleString('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [month, day, year] = tokyoDate.split('/');
  return { year, month, day };
};

export const getCurrentFullDate = (): string => {
  const now = new Date();
  const currentFullDate = now.toLocaleString('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return currentFullDate;
};

const getTimezoneOffsetFromTokyo = (date: Date): number => {
  const TOKYO_TIMEZONE_OFFSET = -540;
  const currentTimeZoneOffset = date.getTimezoneOffset();

  const timezoneOffsetDiff = currentTimeZoneOffset - TOKYO_TIMEZONE_OFFSET;

  return timezoneOffsetDiff;
};

const shiftToTokyoTimezone = (date: Date): Date => {
  const timeZoneOffsetDiff = getTimezoneOffsetFromTokyo(date);

  const shiftedDate = new Date();
  shiftedDate.setTime(shiftedDate.getTime() + timeZoneOffsetDiff * 1000 * 60);

  return shiftedDate;
};

// NOTE: this returns the milliseconds til tomorrow based on Asia/Tokyo time.
export const getMillisecondsTilTomorrowAt = (hour: number): number => {
  if (Math.floor(hour) <= 23 && Math.floor(hour) >= 0) {
    const currentDate = new Date();

    const currentDateTokyoTime = shiftToTokyoTimezone(currentDate);
    const tomorrowDateTokyoTime = shiftToTokyoTimezone(currentDate);
    tomorrowDateTokyoTime.setDate(currentDateTokyoTime.getDate() + 1);
    tomorrowDateTokyoTime.setHours(hour, 0, 0, 0);

    return tomorrowDateTokyoTime.getTime() - currentDateTokyoTime.getTime();
  } else {
    throw 'Error: Please use hour between 0 to 23.';
  }
};

export const getOneDigitDate = (date: string): string => {
  if (date[0] === '0') {
    return date.slice(1);
  } else {
    return date;
  }
};
