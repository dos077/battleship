const Ship = ({size}) => {
  const hp = new Array(size).fill(1);
  const hit = (n) => {
    hp[n] = 0;
  }

  const isSunk = () => {
    const totalHp = hp.reduce((x, y) => { return x + y; });
    return (totalHp == 0)? true : false;
  }

  return { hit, isSunk }
}

export default Ship
