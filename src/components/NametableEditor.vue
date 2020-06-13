<template>
  <div>
    <p>index {{index}}</p>
    <div id="container" v-on:click="click">
      <div id="selector" v-bind:style="selectorStyle"
      v-bind:class="{x2: selectScale == 2}">&nbsp;</div>
      <canvas ref="canvas" width="512" height="480"></canvas>
    </div>
  </div>
</template>

<script>
import { NESCOLORSRGBA } from '../Constants';

export default {
  name: 'NametableEditor',
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
  watch: {
    characters: function() {
      this.redraw();
    },
    palette: function() { 
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
    click: function(evt) {
      // setting the top-left corner of the selected characters
      const row = Math.floor(evt.offsetY / 16);
      const col = Math.floor(evt.offsetX / 16);

      this.index = (row * 32) + col;
    },
    redraw: function() {
      const offscreenCtx = this.offscreen.getContext('2d');
      const imageData = offscreenCtx.getImageData(0, 0, 256, 240);
      const buf = new ArrayBuffer(imageData.data.length);
      const buf8 = new Uint8ClampedArray(buf);
      const buf32 = new Uint32Array(buf);

      let buf_i = 0;
      for (let row = 0; row < 30; row++) {
        for (let col = 0; col < 32; col++) {
          const char = (row * 32) + col;
          const attr = (Math.floor(row / 64) * 16) + Math.floor(col / 2.0);

          const sprite = this.characters[this.nametable[char]];
          const pal = this.palettes[this.attributes[attr]];

          for (let ti = 0; ti < 8; ti++) {
            for (let tj = 0; tj < 8; tj++) {
              buf_i = (row * 2048) + (ti * 256) + (col * 8) + tj; 
              const whichColor = sprite[(ti * 8) + tj];
              buf32[buf_i] = NESCOLORSRGBA[pal[whichColor]];
            }
          }
        }
      }
      imageData.data.set(buf8);
      offscreenCtx.putImageData(imageData, 0, 0);
      this.ctx.drawImage(this.offscreen, 0, 0, 256, 240);
    }
  },
  computed: {
    selectorStyle: function() {
      return {
        top: `${Math.floor(this.index / 32) * 16}px`,
        left: `${(this.index % 32) * 16}px`,
      }
    }
  },
  data: () => {
    return {
      index: 0,
      selectScale: 1,
      ctx: null,
      offscreen: new OffscreenCanvas(256, 240)
    } 
  }
}
</script>

<style scoped>
div#container {
  position: relative;
  height: 480px;
  width: 512px;
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
  line-height: 16px;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  border: 3px white double;
}

div#selector.x2 {
  line-height: 32px;
  width: 32px;
  height: 32px;
}
</style>
