const { fizzBuzz } = require('../files-to-test/exercise1');

describe('fizzBuzz', () => {
  test('should throw exception is given input is not a number', () => {
    expect(() => {
      fizzBuzz('a');
    }).toThrow();
    expect(() => {
      fizzBuzz(null);
    }).toThrow();
    expect(() => {
      fizzBuzz(undefined);
    }).toThrow();
    expect(() => {
      fizzBuzz({});
    }).toThrow();
    expect(() => {
      fizzBuzz('a');
    }).toThrow();
  });

  test('should return FizzBuzz if input is divisible by 3 and 5', () => {
    const result = fizzBuzz(15);
    expect(result).toBe('FizzBuzz');
  });

  test('should return FizzBuzz if input is only divisible by 3', () => {
    const result = fizzBuzz(3);
    expect(result).toBe('Fizz');
  });

  test('should return FizzBuzz if input is only divisible by 5', () => {
    const result = fizzBuzz(5);
    expect(result).toBe('Buzz');
  });

  test('should return the input if it is not divisible by 3 or 5', () => {
    const result = fizzBuzz(1);
    expect(result).toBe(1);
  });
});
