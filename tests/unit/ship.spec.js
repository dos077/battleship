import Ship from '@/ship.js'

describe('Ship size 3', () => {
  const testShip = Ship({size: 3});

  it('floats', () => {
    expect(testShip.isSunk()).toBe(false);
  });

  it('stays afloat after two hits', () => {
    testShip.hit(0); testShip.hit(1);
    expect(testShip.isSunk()).toBe(false);
  });

  it('sinks after 3 hits', () => {
    testShip.hit(2);
    expect(testShip.isSunk()).toBe(true);
  })
});