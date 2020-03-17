import Ship from './Ship.js'

const GameBoard = () => {
  const board = [];
  const float = [];
  const sunk = [];

  for(let x=0;x<10;x++) {
    board.push([]);
    for(let y=0;y<10;y++) {
      board[x].push({
        ship: false,
        pos: false,
        hit: false
      });
    }
  }

  const readOut = [];

  for(let x=0;x<10;x++) {
    readOut.push([]);
    for(let y=0;y<10;y++) {
      readOut[x].push(false);
    }
  }

  const ships = [];

  const newShip = ({name, start, end, size}) => {
    const ship = Ship({size, name});
    ships.push(ship);
    const dX = (end.x - start.x) / (size - 1);
    const dY = (end.y - start.y) / (size - 1);
    for(let i=0; i < size; i++) {
      let x = start.x + (dX * i);
      let y = start.y + (dY * i);
      board[x][y] = { ship: ship, pos: i, hit: false  }
      ship.addCrd({x, y});
    }
    shipCount();
  }

  const updateRead = ({x, y, lc}) => {
    if(lc.ship) {
      if(lc.ship.isSunk()) {
        lc.ship.crds.forEach(function(crd){
          readOut[crd.x][crd.y] = 's';
        });
      } else {
        readOut[x][y] = 'x';
      }
    } else {
      readOut[x][y] = 'o';
    }
  }
  
  const attack = ({x, y}) => {
    const lc = board[x][y];
    if(!lc || lc.hit) { return false; }
    lc.hit = true;
    if(lc.ship) {
      lc.ship.hit(lc.pos);
      updateRead({x, y, lc});
      if(lc.ship.isSunk) shipCount();
      return 1;
    } else {
      updateRead({x, y, lc});
      return 0;
    }
  }

  const shipCount = () => {
    float.splice(0, float.length);
    sunk.splice(0, sunk.length);
    ships.forEach((ship) => {
      const shipData = { name: ship.name, size: ship.size }
      if(ship.isSunk()) {
        sunk.push(shipData);
      } else {
        float.push(shipData);
      }
    })
  }

  const emptyCells = () => {
    const targets = [];
    board.forEach(function(col, x){
      targets[x] = [];
      col.forEach(function(cell, y){
        if(cell.ship) {
          targets[x][y] = false;
        } else {
          targets[x][y] = true;
        }
      });
    });
    return targets;
  }

  const buildTargets = (origin, size) => {
    let count = 0;
    if(size) {
      const dirs = [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: -1, y: 0 }
      ]
      const targets = [];
      for(let i=0;i<dirs.length;i++) {
        const direction = dirs[i];
        for(let d=1;d<size;d++) {
          const x = direction.x * d + origin.x;
          const y = direction.y * d + origin.y;
          if(x < 0 || x > 9) break;
          if(y < 0 || y > 9) break;
          if(board[x][y].ship) break;
          if(d == (size - 1)) {
            if(!targets[x]) targets[x] = [];
            count++;
            targets[x][y] = true;
          }
        }
      }
      return (count > 0)? targets : false;
    } else {
      return emptyCells();
    }
  }

  return { newShip, attack, readOut, float, sunk, buildTargets }
}

export default GameBoard