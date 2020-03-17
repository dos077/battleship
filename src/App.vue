<template>
  <div id="app">
    <div class="game">
      <section v-for="(player, index) in players"
        :key="index" :class="'side-' + player.id">
        <div v-if="(!player.turn && isSetup) || (player.turn && !isSetup) || gameOver" class="blocker">
          {{msgs[index]}}
        </div>
        <header>{{player.name}}</header>
        <player-view         
          :turn="player.turn" 
          :shipStock="player.shipStock"
          :isSetup="isSetup"
          :board="player.board"
          :vsAI="player.vsAI"
          @turn-done="nextTurn()"
          @game-lost="gameLost(index)"
        ></player-view>
      </section>  
    </div>
  </div>
</template>

<script>
import PlayerView from './components/PlayerView.vue'
import GameBoard from './GameBoard.js'
import AI from './AI.js'

export default {
  name: 'app',
  components: {
    'player-view': PlayerView,
  },
  data() {
    return {
      players: [
        { id: 0, name: 'Player', turn: true, shipStock: this.newShipStock(), board: GameBoard(), vsAI: true },
        { id: 1, name: 'Computer', turn: false, shipStock: this.newShipStock(), board: GameBoard(), computer: AI() }
      ],
      msgs: [
        'Please Wait for Your Turn',
        'Please Wait for Your Turn',
      ],
      winner: -1,
    }
  },
  computed: {
    isSetup() {
      const shipsLeft = this.players.reduce((a,  b) => {
        return a.shipStock.length + b.shipStock.length;
      });
      return (shipsLeft > 0)? true : false;
    },
    gameOver() {
      return (this.winner > -1);
    }
  },
  methods: {
    newShipStock() {
      return [
        { name: 'Carrier', size: 5 },
        { name: 'Battleship', size: 4 },
        { name: 'Submarine', size: 3 },
        { name: 'Destroyer', size: 3 },
        { name: 'Patrol Boat', size: 2 },
      ]
    },
    computerSetup(player) {
      player.computer.setupBoard(player.shipStock, player.board);
    },
    computerAttack(computer, board) {
      computer.updateShips(board.float);
      const move = computer.nextAttack();
      board.attack(move);
      const sunk = (board.readOut[move.x][move.y] === 's');
      const hit = sunk || (board.readOut[move.x][move.y] === 'x')
      const data = {
        x: move.x,
        y: move.y,
        hit,
        sunk,
      }
      computer.recordMove(data);
      this.checkLoser();
    },
    nextTurn() {
      const current = this.players.find(p => p.turn);
      const next = this.players.find(p => !p.turn);
      current.turn = false;
      next.turn = true;
      if(this.isSetup && next.computer) {
        this.computerSetup(next);
        this.updateMsgs();
        next.turn = false;
        current.turn = true;
      } else if(next.computer) {
        const attack = this.computerAttack;
        setTimeout(function() {
          attack(next.computer, current.board);
          next.turn = false;
          current.turn = true;
        }, 500);
      } else {
        this.checkLoser();
        next.turn = true;
      }
    },
    gameLost(index) {
      this.winner = (index === 1)? 0 : 1;
    },
    checkLoser() {
      let loser = -1;
      this.players.forEach(function(p) {
        if(p.board.float.length === 0) {
          p.lost = true;
          loser = p.id;
        }
      });
      if(loser > -1) this.gameLost(loser);
      this.updateMsgs();
    },
    updateMsgs() {
      for(let i=0;i<this.msgs.length;i++) {
        if(this.gameOver) {
          this.msgs[i] = (this.winner === i)? 'Winner!' : 'Better Luck Next Time';
        } else if(!this.isSetup) {
          this.msgs[i] = 'Attack!';
        }
      }
    }
  },
}
</script>

<style lang="scss">
@import './sass/setting';

.game {
  display: flex;
  width: 40rem;
  height: 100%;
  margin: 0 auto;
  flex-direction: row;
}
section[class*="side-"] {
  position: relative;
  width: 20rem;
  height: 100%;
  padding: 1rem;
  header {
    width: 100%;
    margin-bottom: 1rem;
    font-size: 2.4rem;
    line-height: 3rem;
    text-align: center;
  }
}

div.blocker {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  font-size: 2.4rem;
  line-height: 3rem;
  text-align: center;
  width: 100%;
  height: 100%;
}

.side-0 {
  background-color: $p1-bg;
  header {
    color: $p1-color;
  }
  .blocker {
    background-color: rgba($p1-bg, .7);
  }
}
.side-1 {
  background-color: $p2-bg;
  header {
    color: $p2-color;
  }
  .blocker {
    background-color: rgba($p2-bg, .7);
  }
}

</style>
