<template>
  <canvas ref="canvas" width="384" height="384"></canvas>
</template>

<script>
import { NESCOLORSRGBA } from '../Constants';

const SpritesPerRow = 16;
const CanvasDim = 8 * SpritesPerRow;

export default {
  name: 'PixelDisplay',
  props: {
    characters: {
      type: Array,
      default: () => new Array(256).fill(new Array(64).fill(0))
    },
    palette: {
      type: Array,
      default: () => [13,3,19,35]
    },
    topLeftChr: {
      type: Number,
      default: () => 0
    },
    editorZoom: {
      type: Number,
      default: () => 2
    }
  },
  watch: {
    characters: function() {
      this.redraw();
      this.reposition();
    },
    palette: function() {
      this.redraw();
      this.reposition();
    },
    topLeftChr: function() {
      this.reposition();
    },
    editorZoom: function() {
      this.reposition();
    }
  },
  mounted() {
    this.ctx = this.$refs['canvas'].getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.redraw();
    this.reposition();
  },
  methods: {
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
    },
    reposition: function() {
      const row = Math.floor(this.topLeftChr / 16);
      const col = this.topLeftChr % 16;
      if (this.editorZoom == 1) {
        this.ctx.drawImage(this.offscreen, col * 8, row * 8, 8, 8, 0, 0, 384, 384);
      } else if (this.editorZoom == 2) {
        this.ctx.drawImage(this.offscreen, col * 8, row * 8, 16, 16, 0, 0, 384, 384);
      } else if (this.editorZoom == 4) {
        this.ctx.drawImage(this.offscreen, col * 8, row * 8, 32, 32, 0, 0, 384, 384);
      }
    }
  },
  data() {
    return {
      ctx: null,
      offscreen: new OffscreenCanvas(CanvasDim, CanvasDim)
    } 
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
