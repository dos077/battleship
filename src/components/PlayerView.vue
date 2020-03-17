<template>
  <div class="player">
    <board-view
      :buildTargets="buildTargets"
      :attackable="attackable"
      :isSetup="isSetup"
      :cols="board.readOut"
      :selected="cellSelected || {x: -1, y: -1}"
      @build="build"
      @attack="attack"
    >
    </board-view>
    <ships-view
      :shipStock="shipStock"
      :float="(isSetup)? [] : float"
      :sunk="(isSetup)? [] : sunk"
      :select="shipSelected"
      @select="selectShip"
    ></ships-view>
  </div>
</template>

<script>
import BoardView from './BoardView.vue';
import ShipsView from './ShipsView.vue';

export default {
  name: 'PlayerView',
  components: {
    'board-view': BoardView,
    'ships-view': ShipsView,
  },
  props: {
    turn: Boolean,
    shipStock: Array,
    isSetup: Boolean,
    board: Object,
    vsAI: Boolean,
  },
  data() {
    return { 
      shipSelected: -1,
      start: {},
      cellSelected: false,
      float: this.board.float,
      sunk: this.board.sunk,
    }
  },
  computed: {
    buildTargets: function() {
      if(!this.isSetup || this.shipSelected < 0) { return []; }
      else if(!this.cellSelected) {
        return this.board.buildTargets();
      }
      else {
        const origin = { x: this.cellSelected.x, y: this.cellSelected.y }
        const size = this.shipStock[this.shipSelected].size;
        const targets = this.board.buildTargets(origin, size);
        return targets;
      }
    },
    blocked: function() {
      return (!this.turn && this.isSetup) || (this.turn && !this.isSetup);
    },
    attackable() {
      return (!this.isSetup && !this.turn && !this.vsAI )
    }
  },
  methods: {
    newShip({index, start, end}) {
      const ship = this.shipStock[index];
      if(ship) {
        this.board.newShip({name: ship.name, start: start, end: end, size: ship.size});
        this.shipStock.splice(index, 1);
        if(this.shipStock.length === 0) this.$emit('turn-done');
      }
    },
    selectShip(index) {
      this.shipSelected = index;
    },
    build({x, y}) {
      if(!this.cellSelected) {
        this.cellSelected = { x, y }
        if(!this.buildTargets) this.cellSelected = false;
      } else {
        const start = {}
        start.x = this.cellSelected.x;
        start.y = this.cellSelected.y;
        const end = { x, y }
        this.newShip({ index: this.shipSelected, start, end });
        this.cellSelected = false;
        this.shipSelected = -1;
      }
    },
    attack({x, y}) {
      this.board.attack({x, y});
      this.$emit('turn-done');
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../sass/setting';

div.player {
  position: relative;
  display: inline-block;
  width: 100%;
}

</style>
