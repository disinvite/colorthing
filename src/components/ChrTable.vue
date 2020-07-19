<template>
  <ContainerRelative v-bind:width="384" v-bind:height="384">
    <MouseGrid
      v-bind:width="384"
      v-bind:height="384"
      v-bind:dimX="16"
      v-bind:dimY="16"
      v-on:leftClick="mousedown"
      v-on:leftDrag="mousedown"
      v-on:rightClick="changeSelectSize"
      v-on:rightDrag="changeSelectSize"
    />
    <SelectorDisplay
      v-bind:selectWidth="selectWidth"
      v-bind:selectHeight="selectHeight"
      v-bind:value="value"
    />
    <canvas ref="canvas" width="384" height="384"></canvas>
  </ContainerRelative>
</template>

<script>
import { NESCOLORSRGBA } from '../Constants';
import ContainerRelative from './common/ContainerRelative';
import MouseGrid from './common/MouseGrid';
import SelectorDisplay from './common/SelectorDisplay';

const SpritesPerRow = 16;
const DisplayScale = 3;
const CanvasDim = 8 * SpritesPerRow;

export default {
  name: 'ChrTable',
  props: {
    characters: Array,
    value: Number,
    palette: Array,
    selectWidth: {
      type: Number,
      default: 1
    },
    selectHeight: {
      type: Number,
      default: 1
    }
  },
  watch: {
    characters: function() {
      this.redraw();
    },
    palette: function() { 
      this.redraw();
    }
  },
  components: {
    ContainerRelative,
    MouseGrid,
    SelectorDisplay
  },
  methods: {
    mousedown: function({row, col}) {
      this.$emit('input', (row * 16) + col);
    },
    changeSelectSize: function({row, col}) {
      const oldRow = Math.floor(this.value / 16);
      const oldCol = this.value % 16;
      const width = Math.max(1, 1 + col - oldCol);
      const height = Math.max(1, 1 + row - oldRow);
      this.$emit('changeSelectSize', {width, height});
    },
    redraw: function() {
      const ctx = this.offscreen.getContext('2d');
      const imageData = ctx.getImageData(0, 0, CanvasDim, CanvasDim);
      const buf = new ArrayBuffer(imageData.data.length);
      const buf8 = new Uint8ClampedArray(buf);
      const buf32 = new Uint32Array(buf);

      let buf_i = 0;

      for (let chr_i = 0; chr_i < this.characters.length; chr_i++) {
        const gx = (chr_i % SpritesPerRow); // which column on the 16 x 16 grid?
        const gy = Math.floor(chr_i / SpritesPerRow); // which row?

        // pixels now
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const char = this.characters[chr_i];
            const pix = (row * 8) + col;
            const palColor = this.palette[char[pix]];
            buf_i = (gy * 8 * CanvasDim) + (row * CanvasDim) + (gx * 8) + col;
            buf32[buf_i] = NESCOLORSRGBA[palColor];
          }
        }
      }

      imageData.data.set(buf8);
      ctx.putImageData(imageData, 0, 0);
      this.ctx.drawImage(this.offscreen, 0, 0, CanvasDim, CanvasDim);
    }
  },
  mounted: function() {
    this.ctx = this.$refs['canvas'].getContext('2d');
    this.ctx.scale(DisplayScale, DisplayScale);
    this.ctx.imageSmoothingEnabled = false;
    this.redraw();
  },
  data: () => {
    return {
      ctx: null,
      offscreen: new OffscreenCanvas(CanvasDim, CanvasDim)
    };
  }
}
</script>

<style scoped>
canvas {
  z-index: -100;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
