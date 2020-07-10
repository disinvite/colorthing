<template>
  <div>
    <div style="display:flex">
      <div id="container">
        <MouseGrid
          v-bind:width="512"
          v-bind:height="480"
          v-bind:dimX="32"
          v-bind:dimY="30"
          v-on:leftClick="mousedown"
          v-on:leftDrag="mouseover"
        />
        <PPUDisplay
          v-bind:characters="characters"
          v-bind:palettes="palettes"
          v-bind:nametable="nametable"
          v-bind:attributes="attributes"
        />
      </div>
      <ChrTable
        v-bind:characters="characters"
        v-bind:palette="currentPalette"
        v-model="chrSelect"
      />
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
import ChrTable from './ChrTable.vue'
import MouseGrid from './MouseGrid.vue'
import PPUDisplay from './PPUDisplay.vue'

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
    }
  },
  components: {
    ChrTable,
    MouseGrid,
    PPUDisplay
  },
  methods: {
    mousedown: function({row, col}) {
      const which = row*32 + col;
      if (this.editAttribute) {
        const attr = simpleAttrMap[which];
        this.attributes[attr] = this.selectedAttribute;
        this.$emit('attributeChange', this.attributes);
      } else {
        this.nametable[which] = this.chrSelect;
        this.$emit('nametableChange', this.nametable);
      }
    },
    mouseover: function({row, col}) {
      const which = row*32 + col;
      if (this.editAttribute) {
        const attr = simpleAttrMap[which];
        this.attributes[attr] = this.selectedAttribute;
        this.$emit('attributeChange', this.attributes);
      } else {
        this.nametable[which] = this.chrSelect;
        this.$emit('nametableChange', this.nametable);
      }
    },
  },
  computed: {
    currentPalette: function() {
      return this.palettes[this.selectedAttribute];
    }
  },
  data: () => {
    return {
      chrSelect: 0,
      ctx: null,
      editAttribute: false,
      showAttribute: false,
      selectedAttribute: 0
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
</style>
