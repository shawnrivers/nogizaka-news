import { relatesToNogizaka } from "./nogizaka";

test('relatesToNogizaka should return true when the parameter string contains "乃木坂46"', () => {
  expect(relatesToNogizaka('乃木坂46')).toBe(true);
})
