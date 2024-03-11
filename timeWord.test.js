const timeWord = require('./timeWord');

describe('#timeword', () => {
  test('it is a function', () => {
    expect(typeof timeWord).toBe('function');
  });
  test('it returns midnight', () => {
    expect(timeWord("00:00")).toEqual("midnight");
  });
  test('it returns noon', () => {
    expect(timeWord("12:00")).toEqual("noon");
  });
  test('it returns morning time accurately', () => {
    expect(timeWord("04:30")).toEqual("four thirty am");
  });
  test('it returns afternoon time accurately', () => {
    expect(timeWord("16:30")).toEqual("four thirty pm");
  });
  test("it returns o'clock", () => {
    expect(timeWord("18:00")).toEqual("six o'clock pm");
  });
  test("it returns oh one", () => {
    expect(timeWord("18:01")).toEqual("six oh one pm");
  });
  test("it throws an error for invalid hour input", () => {
    try {
      timeWord("27:30");
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
      expect(err.message).toEqual(`Invalid time input`)
    }
  });
  test("it throws an error for invalid minute input", () => {
    try {
      timeWord("20:70");
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
      expect(err.message).toEqual(`Invalid time input`)
    }
  });
  test("it throws an error for negative hour input", () => {
    try {
      timeWord("-20:10");
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
      expect(err.message).toEqual(`Invalid time input`)
    }
  });
  test("it throws an error for negative minute input", () => {
    try {
      timeWord("20:-10");
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
      expect(err.message).toEqual(`Invalid time input`)
    }
  });
});