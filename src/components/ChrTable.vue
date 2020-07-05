<template>
  <div id="container" v-on:click="click">
      <div id="selector"
        v-bind:style="{top: `${Math.floor(value / 16) * 24}px`, left: `${(value % 16) * 24}px`}"
        v-bind:class="{x2: selectSize == 2, x4: selectSize == 4}"
        >&nbsp;</div>
    <canvas ref="canvas" width="384" height="384"></canvas>
  </div>
</template>

<script>
import { NESCOLORSRGBA } from '../Constants';

const SpritesPerRow = 16;
const DisplayScale = 3;
const CanvasDim = 8 * SpritesPerRow;

export default {
  name: 'ChrTable',
  props: {
    characters: Array,
    value: Number,
    palette: Array,
    selectSize: {
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
    },
    selectSize: function(val) {
      // need to bump the value if we are selecting
      // too close to the edge for the current selectsize.
      let row = Math.floor(this.value / 16.0);
      let col = this.value % 16;

      if (val == 2) {
        if ((row > 14) || (col > 14)) {
          row = Math.min(row, 14);
          col = Math.min(col, 14);
          this.$emit('input', (row * 16) + col);
        }
      } else if (val == 4) {
        if ((row > 12) || (col > 12)) {
          row = Math.min(row, 12);
          col = Math.min(col, 12);
          this.$emit('input', (row * 16) + col);
        }
      }
    }
  },
  methods: {
    click: function(evt) {
      // setting the top-left corner of the selected characters
      let row = Math.floor(evt.offsetY / 24);
      let col = Math.floor(evt.offsetX / 24);
      console.log(`${evt.offsetY},${evt.offsetX} --> ${row},${col}`)
      
      // don't select off the edge
      if (this.selectSize == 2) {
        row = Math.min(row, 14);
        col = Math.min(col, 14);
      } else if (this.selectSize == 4) {
        row = Math.min(row, 12);
        col = Math.min(col, 12);
      }

      this.$emit('input', (row * 16) + col);
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
      NESCOLORSRGBA,
      ctx: null,
      offscreen: new OffscreenCanvas(CanvasDim, CanvasDim)
    };
  }
}
</script>

<style scoped>
div#container {
  position: relative;
  height: 384px;
  width: 384px;
}
canvas {
  z-index: -100;
  position: absolute;
  top: 0;
  left: 0;
}
div#selector {
  pointer-events: none; /* not a possible click target */
  position: absolute;
  display: inline-block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  line-height: 24px;
  vertical-align: middle;
  width: 24px;
  height: 24px;
  border: 3px white double;
}
div#selector.x2 {
  line-height: 48px;
  width: 48px;
  height: 48px;
}
div#selector.x4 {
  line-height: 96px;
  width: 96px;
  height: 96px;
}
</style>
