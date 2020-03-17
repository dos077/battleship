import GameBoard from '@/GameBoard.js'

describe('game board', () => {
  const board = GameBoard();
  const start = { x: 0, y: 0 }
  const end = { x: 0, y: 3 }
  board.newShip({ start: start, end: end, size: 4 });

  it('shows buildable spots', () => {
    const buildTargets = board.buildTargets();
    expect(buildTargets.length).toBe(10);
    buildTargets.forEach(function(col) {
      expect(col.length).toBe(10);
    });
    expect(buildTargets[0][0]).toBe(false);
    expect(buildTargets[0][3]).toBe(false);
    expect(buildTargets[0][4]).toBe(true);
    expect(buildTargets[1][0]).toBe(true);
    expect(buildTargets[1][1]).toBe(true);
    expect(buildTargets[9][9]).toBe(true);
  });

  it('shows possible end point for ships', () => {
    const buildTargets = board.buildTargets({x: 3, y: 3}, 4);
    expect(!buildTargets[0]).toBe(true);
    expect(buildTargets[6][3]).toBe(true);
    expect(buildTargets[3][0]).toBe(true);
  });

  it('reads false on unhit cell', () => {
    expect(board.readOut[0][0]).toBe(false);
  });

  it('reads x on a hit', () => {
    expect(board.attack({x: 0, y: 0})).toBe(1);
    expect(board.readOut[0][0]).toBe('x');
  })

  it('reads o on a miss', () => {
    const hit = board.attack({x: 1, y: 1});
    expect(hit).toBe(0);
    expect(board.readOut[1][1]).toBe('o');
  });

  it('counts floating and sunk ship', () => {
    expect(board.float.length).toBe(1);
    expect(board.sunk.length).toBe(0);
  });

  it('reads s on sunk ship', () => {
    board.attack({x: 0, y: 1});
    board.attack({x: 0, y: 2});
    board.attack({x: 0, y: 3});
    expect(board.readOut[0][1]).toBe('s');
    expect(board.readOut[0][2]).toBe('s');
    expect(board.readOut[0][3]).toBe('s');
  })

  it('keeps track of sunk ship', () => {
    expect(board.float.length).toBe(0);
    expect(board.sunk.length).toBe(1);
  });

  it('read out all the cells', () => {
    const readOut = board.readOut;
    expect(readOut.length).toBe(10);
    readOut.forEach(function(col) {
      expect(col.length).toBe(10);
    });
  });

});