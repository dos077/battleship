<template>
  <section class="board">
    <div class="col" v-for="(col, x) in cols" :key="x">
      <div
        :id="'c' + x + '-' + y"
        :class="{
          'cell': true,
          'selected': (selected && x === selected.x && y === selected.y)
        }"
        v-for="(cell, y) in col"
        :key="y"
      >
        <span :id="'b' + x + '-' + y" class="dot target" v-if="buildTargets[x] && buildTargets[x][y]" @click="$emit('build', {x, y})">
        </span>
        <span :id="'a' + x + '-' + y" class="dot target" v-if="attackable && !cell" @click="$emit('attack', {x, y})"></span>
        {{(cell)? cell : ' '}}
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BoardView',
  props: {
    isSetup: Boolean,
    attackable: Boolean,
    buildTargets: Array,
    cols: Array,
    selected: Object,
  },
}
</script>

<style lang="scss" scoped>
@import '../sass/setting';

.board {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  overflow: hidden;
  border: .1rem solid $prime-color;
}
.col {
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  overflow: hidden;
}
.cell {
  position: relative;
  width: 1.8rem;
  height: 1.8rem;
  text-align: center;
  line-height: 1.5rem;
  border: .1rem solid $prime-color;
  &.selected {
    background-color: #ddd;
  }
  .dot {
    position: absolute;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 10%;
    left: 10%;
    width: 80%;
    height: 80%;
    border-radius: 50%;
    border: .15rem solid;
    border-color: rgba($prime-color, 0);
    &:before {
      content: " ";
      display: block;
      margin-top: 0;
      width: .3rem;
      height: .3rem;
      border-radius: 50%;
      background-color: $prime-color;
      opacity: .5;
    }
    &:hover{
      border-color: $prime-color;
      &:before {
        opacity: 1;
      }
    }
  }
}

</style>
