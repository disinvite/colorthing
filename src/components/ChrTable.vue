<template>
  <div id="container">
    <ul id="over">
      <li
        v-for="(char, index) in characters"
        v-bind:key="index"
        v-bind:class="{ selected: index === value }"
        v-on:click="$emit('input', index)">&nbsp;</li>
    </ul>
    <canvas ref="canvas" width="256" height="1024"></canvas>
  </div>
</template>

<script>
import { NESCOLORSRGBA } from '../Constants';

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
      const ctx = this.offscreen.getContext('2d');
      const imageData = ctx.getImageData(0, 0, 64, 256);
      const buf = new ArrayBuffer(imageData.data.length);
      const buf8 = new Uint8ClampedArray(buf);
      const buf32 = new Uint32Array(buf);

      let buf_i = 0;

      for (let chr_i = 0; chr_i < this.characters.length; chr_i++) {
        const gx = (chr_i % 8); // which column on the 8 x 32 grid?
        const gy = Math.floor(chr_i / 8); // which row?
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const char = this.characters[chr_i];
            const pix = (row * 8) + col;
            const palColor = this.palette[char[pix]];
            buf_i = (gy * 512) + (row * 64) + (gx * 8) + col;
            buf32[buf_i] = NESCOLORSRGBA[palColor];
          }
        }
      }

      imageData.data.set(buf8);
      ctx.putImageData(imageData, 0, 0);
      this.ctx.drawImage(this.offscreen, 0, 0, 64, 256);
    }
  },
  mounted: function() {
    this.ctx = this.$refs['canvas'].getContext('2d');
    this.ctx.scale(4, 4);
    this.ctx.imageSmoothingEnabled = false;
    this.redraw();
  },
  data: () => {
    return {
      NESCOLORSRGBA,
      ctx: null,
      offscreen: new OffscreenCanvas(64, 256)
    };
  }
}
</script>

<style scoped>
div#container {
  position: relative;
  height: 256px;
  width: 256px;
  overflow: scroll;
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
  width: 256px;
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
