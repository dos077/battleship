import AI from '@/AI.js'
import GameBoard from '@/GameBoard.js'

const board = GameBoard();
const shipStock = [
                    { name: 'Battleship', size: 4 },
                    { name: 'Patrol Boat', size: 2 },
                  ]
const computer = AI();
const floatList = [
  { name: 'carrier', size: 5 },
  { name: 'battleship', size: 4 },
]
computer.updateShips(floatList);

describe('setting up board', () => {
  computer.setupBoard(shipStock, board);
  it('randomly places boats', () => {
    expect(board.float.length).toBe(2);
  });
  it('clear ship stock', () => {
    expect(shipStock.length).toBe(0);
  });
});

describe('finds attack target', () => {
  it('targets the center to start', () => {
    const target = computer.nextAttack();
    expect(target.x > 2 && target.x < 7).toBe(true);
    expect(target.y > 2 && target.y < 7).toBe(true);
  });
  it('targets adjacent cell after a hit', () => {
    const x = 4, y = 4, hit = true, sunk = false;
    computer.recordMove({x, y, hit, sunk});
    const target = computer.nextAttack();
    expect(target.x == 3 || target.x == 4 || target.x == 5).toBe(true);
    expect(target.y == 3 || target.y == 4 || target.y == 5).toBe(true);
  });
  it('chase direction of hit', () => {
    const x = 4, y = 5, hit = true, sunk = false;
    computer.recordMove({x, y, hit, sunk});
    const target = computer.nextAttack();
    expect(target.x).toBe(4);
    expect(target.y == 3 || target.y == 6).toBe(true);
  });
  it('changes directions at dead end', () => {
    const x = 4, y = 6, hit = false, sunk = false;
    computer.recordMove({x, y, hit, sunk});
    const target = computer.nextAttack();
    expect(target.x).toBe(4);
    expect(target.y).toBe(3);
  });
  it('recalibrate to mutliship', () => {
    const x = 4, y = 3, hit = false, sunk = false;
    computer.recordMove({x, y, hit, sunk});
    const target = computer.nextAttack();
    expect(target.y).toBe(4);
    expect(target.x == 3 || target.x == 5).toBe(true);
  });
  it('chases second ship after sinking first', () => {
    const x = 3, y = 4, hit = true, sunk = true;
    computer.recordMove({x, y, hit, sunk});
    const target = computer.nextAttack();
    expect(target.y).toBe(5);
    expect(target.x == 3 || target.x == 5).toBe(true);
  });
});