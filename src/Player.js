
const Player = ({shipStock}) => {
  let turn = true;

  const doneSetup = () => {
    if(shipStock.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  const isTurn =() => { return (turn)? true : false; }

  const newShip = ({name, start, end, board}) => {
    const index = shipStock.map(e => { return e.name }).indexOf(name);
    if(index > -1) {
      board.newShip({name, start, end});
      shipStock.splice(index, 1);
      if(doneSetup()) { turn = false; }
      return true;
    } else {
      return false;
    }
  }

  const attack = ({x, y, enemyBoard}) => {
    if(turn) {
      const isAttack = enemyBoard.attack({x, y});
      if(isAttack) {
        turn = false;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  return { doneSetup, isTurn, newShip, attack}
}

export default Player