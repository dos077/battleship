const AI = () => {
  const ranNum = (max = 10) => {
    return Math.floor(Math.random() * max);
  }

  const randomXY = () => {
    return { x: ranNum(), y: ranNum() }    
  }

  const sampleCell = (board) => {
    let x, y;
    while(!x || !board.buildTargets()[x][y]) {
      x = randomXY().x;
      y = randomXY().y;
    }
    return { x, y }
  }

  const setupBoard = (shipStock, board) => {
    while(shipStock.length > 0) {
      let ship = shipStock[0];
      let start;
      let targets = [];
      while(targets.length === 0) {
        start = sampleCell(board);
        targets = board.buildTargets(start, ship.size)
      }
      let end;
      while(!end) {
        let x = ranNum();
        let y = ranNum();
        if(targets[x] && targets[x][y]) end = { x, y }
      }
      const shipData = {
        name: ship.name,
        start: start,
        end: end,
        size: ship.size,
      }
      board.newShip(shipData);
      shipStock.splice(0, 1);
    }
  }

  const enemy = { float: [] }
  const moveList = [];
  const currentShips = [];
  const movesMap = [];

  for(let x=0;x<10;x++) {
    movesMap.push([]);
    for(let y=0;y<10;y++) {
      movesMap[x][y] = false;
      if((x - y) % 2 === 0) movesMap[x][y] = true;
    }
  }

  const movesLeft = () => {
    const moves = [];
    for(let x=0;x<10;x++) {
      for(let y=0;y<10;y++) {
        if(movesMap[x][y]) moves.push({ x, y });
      }
    }
    return moves;
  }

  const hotZones = () => {
    if(!enemy.float.some(s => s.size > 3)) return false;
    const moves = [];
    for(let x=3;x<7;x++) {
      for(let y=3;y<7;y++) {
        if(movesMap[x][y]) moves.push({ x, y });
      }
    }
    return (moves.length > 0)? moves : false;
  }

  const findDrs = () => {
    const ship = currentShips[0];
    if(ship.length == 1) {
      return [{dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx:0, dy: 1}, {dx:0, dy: -1}];
    } else {
      const a = ship[0];
      const b = ship[1];
      if(a.x == b.x) {
        return [{dx: 0, dy: 1}, {dx: 0, dy: -1}];
      } else {
        return [{dx: 1, dy: 0}, {dx: -1, dy: 0}];
      }      
    }
  }

  const followDrs = (ship, drs) => {
    const moves = [];
    const start = ship[0];
    if(ship.length === 1) {
      drs.forEach((dr) => {
        const x = start.x + dr.dx;
        if(x < 0 || x > 9) return;
        const y = start.y + dr.dy;
        if(y < 0 || y > 9) return;
        if(!moveList.some((m) => m.x === x && m.y === y )) moves.push({ x, y })
      });
    } else if(ship.length > 1) {
      const end = ship[(ship.length - 1)];
      drs.forEach((dr) => {
        let oX, oY;
        if(dr.dx > 0) {
          if(start.x > end.x) {
            oX = start.x; oY = start.y;
          } else {
            oX = end.x; oY = end.y;
          }
        } else if(dr.dx < 0 ) {
          if(start.x < end.x) {
            oX = start.x; oY = start.y;
          } else {
            oX = end.x; oY = end.y;
          }
        } else if(dr.dy > 0) {
          if(start.y > end.y) {
            oX = start.x; oY = start.y;
          } else {
            oX = end.x; oY = end.y;
          }
        } else {
          if(start.y < end.y) {
            oX = start.x; oY = start.y;
          } else {
            oX = end.x; oY = end.y;
          }
        }
        const x = oX + dr.dx;
        const y = oY + dr.dy;
        if(!moveList.some((m) => m.x === x && m.y === y )) moves.push({ x, y })
      });
    }
    return moves;
  }

  const followUps = () => {
    if(currentShips.length === 0) return false;
    const ship = currentShips[0];
    const drs = findDrs();
    const moves = followDrs(ship, drs);
    if(moves.length > 0) {
      return moves;
    } else if(ship.length > 1) {
      for(let i=1;i<ship.length;i++) {
        const crd = ship.pop();
        currentShips.push([crd]);
      }
      return followUps();
    }
  }

  const rMove = (moves) => {
    return moves[ranNum(moves.length)];
  }

  const nextAttack = () => {
    const chases = followUps();
    if(chases) return rMove(chases);
    else if(hotZones()) return rMove(hotZones());
    else return rMove(movesLeft());
  }

  const updateShips = (shipList) => {
    enemy.float = shipList;
  }

  const recordMove = ({x, y, hit, sunk}) => {
    moveList.push({x, y});
    movesMap[x][y] = false;
    if(sunk) {
      currentShips.splice(0, 1);
    } else if(hit) {
      if(!currentShips[0]) currentShips[0] = [];
      currentShips[0].push({x, y});
    }
  }

  return { setupBoard, nextAttack, updateShips, recordMove, currentShips, moveList }
  
}

export default AI