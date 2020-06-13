<template>
  <div>
    <p>index {{index}}</p>
    <div id="container">
      <ul class="grid">
        <li v-for="(cell, index) in nametable"
          v-bind:key="index"
          v-on:mousedown.left="mousedown(index)"
          v-on:mouseover="mouseover(index)"
          v-on:contextmenu.prevent
          >&nbsp;</li></ul>
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
    },
    chrSelect: {
      type: Number,
      default: 0
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
  created() {
    document.addEventListener('mouseup', () => this.clickHeld = false);
  },
  mounted() {
    this.ctx = this.$refs['canvas'].getContext('2d');
    this.ctx.scale(2, 2);
    this.ctx.imageSmoothingEnabled = false;
    this.redraw();
  },
  methods: {
    mousedown: function(which) {
      this.clickHeld = true;
      this.index = which;
      console.log(`${which} --> ${this.chrSelect}`);
      this.$set(this.nametable, which, this.chrSelect);
      this.redraw();
    },
    mouseover: function(which) {
      if (this.clickHeld) {
        this.$set(this.nametable, which, this.chrSelect);
        this.redraw();
      }
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
      selectMode: false,
      clickHeld: false,
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
ul {
  list-style: none;
  padding-left: 0;
  display: inline-block;
  margin: 0;
  width: 512px;
  line-height: 0px; /* prevent vertical space when the li's wrap */
}
li {
  user-select: none;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  display: inline-block;
  height: 16px;
  width: 16px;
  color: white;
}
</style>
