export const cutDecimalPlace = (num: number, decimalPointNumber: number): number => {
  const decimal = 10 ** decimalPointNumber;
  return Math.round(num * decimal) / decimal;
};
