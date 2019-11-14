<template>
  <div id="container">
    <ul id="over">
      <li
        v-for="(char, index) in characters"
        v-bind:key="index"
        v-bind:class="{ selected: index === value }"
        v-on:click="$emit('input', index)">&nbsp;</li>
    </ul>
    <canvas ref="canvas" width="128" height="128"></canvas>
  </div>
</template>

<script>
import { NESCOLORS } from '../Constants';

export default {
  name: 'ChrTable',
  props: {
    characters: Array,
    value: Number,
    palette: Array
  },
  watch: {
    characters: function() {
      this.redraw();
    },
    palette: function() { 
      this.redraw();
    }
  },
  methods: {
    redraw: function() {
      for (let chr_i = 0; chr_i < this.characters.length; chr_i++) {
        const gx = (chr_i % 4) * 8;
        const gy = Math.floor(chr_i / 4) * 8;
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const char = this.characters[chr_i];
            const pix = (row * 8) + col;
            const palColor = this.palette[char[pix]];
            this.ctx.fillStyle = NESCOLORS[palColor];
            this.ctx.fillRect(gx + col, gy + row, 1, 1);
          }
        }
      }
    }
  },
  mounted: function() {
    this.ctx = this.$refs['canvas'].getContext('2d');
    this.ctx.scale(4, 4);
    this.redraw();
  },
  data: () => {
    return {
      NESCOLORS,
      ctx: null
    };
  }
}
</script>

<style scoped>
div#container {
  position: relative;
  height: 128px;
  width: 128px;
}
canvas {
  z-index: -100;
}
canvas, ul#over {
  position: absolute;
  top: 0;
  left: 0;
}
ul {
  list-style: none;
  width: 128px;
  margin: 0;
  padding: 0;
}
li {
  display: inline-block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  line-height: 32px;
  vertical-align: middle;
  width: 32px;
  height: 32px;
}
li.selected {
  border: 3px white double;
}
</style>
