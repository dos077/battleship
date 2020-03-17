const Ship = ({size, name}) => {
  const crds = [];

  const hp = new Array(size).fill(1);
  const hit = (n) => {
    hp[n] = 0;
  }

  const isSunk = () => {
    const totalHp = hp.reduce((x, y) => { return x + y; });
    return (totalHp == 0)? true : false;
  }

  const addCrd = (crd) => {
    crds.push(crd);
  }

  return { hit, isSunk, name, crds, addCrd, size }
}

export default Ship
