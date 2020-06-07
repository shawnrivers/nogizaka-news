import { cutDecimalPlace } from '../number';

describe('cutDecimalPlace', () => {
  test('Decimals beyond decimalPointNumber should be eliminated', () => {
    expect(cutDecimalPlace(1.234, 2)).toBe(1.23);
  });

  test('Decimals before decimalPointNumber should be kept', () => {
    expect(cutDecimalPlace(1.234, 4)).toBe(1.234);
  });
});
