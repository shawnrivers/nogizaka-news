import { ScheduleDate } from '../actors/providers/tweeters/scheduleTweeters/BaseScheduleTweeter/types';

export const getToday = (): ScheduleDate => {
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

export const getFullDate = (date: Date): string => {
  return date.toLocaleString('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const getCurrentFullDate = (): string => {
  const now = new Date();

  return getFullDate(now);
};

const getTimezoneOffsetFromTokyo = (date: Date): number => {
  const TOKYO_TIMEZONE_OFFSET = -540;
  const currentTimeZoneOffset = date.getTimezoneOffset();

  const timezoneOffsetDiff = currentTimeZoneOffset - TOKYO_TIMEZONE_OFFSET;

  return timezoneOffsetDiff;
};

const getTokyoDate = (date: Date): Date => {
  const timeZoneOffsetDiff = getTimezoneOffsetFromTokyo(date);

  const shiftedDate = new Date();
  shiftedDate.setTime(shiftedDate.getTime() + timeZoneOffsetDiff * 1000 * 60);

  return shiftedDate;
};

// NOTE: this returns the milliseconds til tomorrow based on Asia/Tokyo time.
export const getMillisecondsTilNextTime = (hour: number): number => {
  if (Math.floor(hour) >= 0 && Math.floor(hour) <= 23) {
    const currentDate = new Date();

    const currentDateTokyoTime = getTokyoDate(currentDate);
    const tomorrowDateTokyoTime = getTokyoDate(currentDate);

    if (currentDateTokyoTime.getHours() >= hour) {
      tomorrowDateTokyoTime.setDate(currentDateTokyoTime.getDate() + 1);
    }

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

// Compare date in h:mm～h:mm format.
export const compareDates = (dateA: string, dateB: string): 1 | 0 | -1 => {
  // '〜': this shit seems to have an alternative code so split both of them.
  const startTimeA = dateA.split('～')[0].split('〜')[0];
  const startTimeB = dateB.split('～')[0].split('〜')[0];

  const hourA = Number(startTimeA.split(':')[0]);
  const minuteA = Number(startTimeA.split(':')[1]);
  const hourB = Number(startTimeB.split(':')[0]);
  const minuteB = Number(startTimeB.split(':')[1]);

  if (hourA > hourB) {
    return 1;
  } else if (hourA === hourB) {
    if (minuteA > minuteB) {
      return 1;
    } else if (minuteA === minuteB) {
      return 0;
    } else {
      return -1;
    }
  } else {
    return -1;
  }
};

export const convertHMS = (
  totalSeconds: number,
): {
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const hourRemainder = totalSeconds % 3600;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(hourRemainder / 60);
  const seconds = hourRemainder % 60;

  return { hours, minutes, seconds };
};

export const isSameDay = (dateA: Date, dateB: Date): boolean =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();
