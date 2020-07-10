<template>
  <canvas ref="canvas" width="512" height="480"></canvas>
</template>

<script>
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
// needed because underscore is a parameter name in the lambdas below

import { NESCOLORSRGBA } from '../Constants';

const range = n => Array.from(Array(n).keys())

const simpleAttrMap = range(16) // 16 rows of 16
  .map(j => range(16)
    .map(i => [16*j + i,16*j + i])
  ).map(k => [k,k]).flat(3).slice(0,960) // each row duplicated

export default {
  name: 'PPUDisplay',
  props: {
    characters: {
      type: Array,
      default: () => new Array(256).fill(new Array(64).fill(0))
    },
    nametable: {
      type: Array,
      default: () => new Array(960).fill(0)
    },
    attributes: {
      type: Array,
      default: () => new Array(64).fill(0)
    },
    palettes: {
      type: Array,
      default: () => [[13,3,19,35]]
    }
  },
  /*
  computed: {
    anyUpdate: function() {
      this.characters;
      this.nametable;
      this.attributes;
      this.palettes;
      return new Date();
    }
  },
  */
  watch: {
    anyUpdate: function() {
      this.redraw();
    },
    characters: function() {
      this.redraw();
    },
    nametable: function() {
      this.redraw();
    },
    attributes: function() {
      this.redraw();
    },
    palettes: function() {
      this.redraw();
    }
  },
  mounted() {
    this.ctx = this.$refs['canvas'].getContext('2d');
    this.ctx.scale(2, 2);
    this.ctx.imageSmoothingEnabled = false;
    this.redraw();
  },
  methods: {
    redraw: function() {
      const offscreenCtx = this.offscreen.getContext('2d');
      const imageData = offscreenCtx.getImageData(0, 0, 256, 240);
      const buf = new ArrayBuffer(imageData.data.length);
      const buf8 = new Uint8ClampedArray(buf);
      const buf32 = new Uint32Array(buf);

      if (this.showAttribute) {
        console.log('haha');
      } else {
        let buf_i = 0;
        // do this all differently
        for (let row = 0; row < 30; row++) {
          for (let col = 0; col < 32; col++) {
            const char = (row * 32) + col;
            const whichPal = this.attributes[simpleAttrMap[char]];

            const sprite = this.characters[this.nametable[char]];
            const pal = this.palettes[whichPal];

            for (let ti = 0; ti < 8; ti++) {
              for (let tj = 0; tj < 8; tj++) {
                buf_i = (row * 2048) + (ti * 256) + (col * 8) + tj; 
                const whichColor = sprite[(ti * 8) + tj];
                buf32[buf_i] = NESCOLORSRGBA[pal[whichColor]];
              }
            }
          }
        }
      }

      imageData.data.set(buf8);
      offscreenCtx.putImageData(imageData, 0, 0);
      this.ctx.drawImage(this.offscreen, 0, 0, 256, 240);
    }
  },
  data() {
    return {
      ctx: null,
      offscreen: new OffscreenCanvas(256, 240)
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
