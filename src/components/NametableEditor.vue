<template>
  <div>
    <div id="container">
      <ul class="grid">
        <li v-for="(cell, index) in nametable"
          v-bind:key="index"
          v-on:mousedown.left="mousedown(index)"
          v-on:mouseover="mouseover(index)"
          v-on:contextmenu.prevent
          >&nbsp;</li>
      </ul>
      <canvas ref="canvas" width="512" height="480"></canvas>
    </div>
    <div>
      <select v-model="selectedAttribute">
        <option v-for="(pal, index) in palettes" v-bind:value="index" v-bind:key="index">Palette {{index}}</option>
      </select>
      <input type="checkbox" v-model="editAttribute" id="editAttribute"/>
      <label for="editAttribute">Attribute edit</label>
    </div>
  </div>
</template>

<script>
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
// needed because underscore is a parameter name in the lambdas below

import { NESCOLORSRGBA } from '../Constants';

// just predefine these things instead of writing fucked up one-liners to derive them

const range = n => Array.from(Array(n).keys())

/*
// for the given 8x8 tile [0...960], which attribute is it?

const attrMap = range(8)  // 8 rows
  .map(j => range(4)      // sub-row duplicated 4 times
    .map(_ => range(8)    // 8 columns of 4 each
      .map(i => Array(4).fill(8*j + i)))).flat(3);

// for the given 8x8 tile [0...960], which pair of bits
// in the attribute value does it belong to?

const subAttrMap = range(8)  // 8 groups of 2 each
  .map(_ => [
    ...range(16).map(_ => [0,0,1,1]),
    ...range(16).map(_ => [2,2,3,3])]).flat(2).slice(0, 960);
*/

const simpleAttrMap = range(16) // 16 rows of 16
  .map(j => range(16)
    .map(i => [16*j + i,16*j + i])
  ).map(k => [k,k]).flat(3).slice(0,960) // each row duplicated

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
    nametable: function() {
      this.redraw();
    },
    palettes: function() { 
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

      if (this.editAttribute) {
        const attr = simpleAttrMap[which];
        this.attributes[attr] = this.selectedAttribute;
        this.$emit('attributeChange', this.attributes);
      } else {
        this.nametable[which] = this.chrSelect;
        this.$emit('nametableChange', this.nametable);
      }
      this.redraw();
    },
    mouseover: function(which) {
      if (this.clickHeld) {
        if (this.editAttribute) {
          const attr = simpleAttrMap[which];
          this.attributes[attr] = this.selectedAttribute;
          this.$emit('attributeChange', this.attributes);
        } else {
          this.nametable[which] = this.chrSelect;
          this.$emit('nametableChange', this.nametable);
        }
        this.redraw();
      }
    },
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
      editAttribute: false,
      showAttribute: false,
      selectedAttribute: 0,
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
  line-height: 16px;
  text-align: center;
  vertical-align: middle;
  font-size: 12px;
  color: white;
}
</style>
