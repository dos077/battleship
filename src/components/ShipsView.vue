<template>
  <div class="ships">
    <div v-for="(ship, index) in shipStock" :key="index" :class="shipClass({ size: ship.size, index: index })">
      <span :id="'s-' + index" class="target" @click="$emit('select', index)"></span>
      {{ship.name}}
    </div>
    <div v-for="ship in float" :class="['ship', 's-' + ship.size]" :key="ship.shipName">
      {{ship.name}}
    </div>
    <div v-for="ship in sunk" :class="['ship', 's-' + ship.size, 'sunk']" :key="ship.shipName">
      {{ship.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShipsView',
  props: {
    shipStock: Array,
    float: Array,
    sunk: Array,
    select: Number,
  },
  methods: {
    shipClass({size, index}) {
      const classes = ['ship'];
      classes.push('s-' + size);
      if(index === this.select) { classes.push('selected'); }
      return classes;
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../sass/setting';

.ship {
  display: inline-block;
  position: relative;
  margin: .8rem 1.6rem 0 0;
  height: 1.6rem;
  overflow: hidden;
  font-size: .8rem;
  line-height: 1.3rem;
  text-align: center;
  border: .2rem solid $prime-color;
  border-radius: .8rem;
  &.selected {
    background-color: #ddd;
    opacity: .5;
    .target { display: none; }
  }
  &.sunk {
    &:before {
      content: ' ';
      display: block;
      position: absolute;
      top: .5rem;
      left: 0;
      width: 100%;
      height: .2rem;
      background-color: rgba($prime-color, .6);
    }
  }
}
.s-2 { width: 3.3rem; }
.s-3 { width: 4.9rem; }
.s-4 { width: 6.6rem; }
.s-5 { width: 8.2rem; }
</style>
