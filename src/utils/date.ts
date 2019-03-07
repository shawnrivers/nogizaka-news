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

export const getOneDigitDate = (date: string): string => {
  if (date[0] === '0') {
    return date.slice(1);
  } else {
    return date;
  }
};
