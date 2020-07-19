<template>
  <div>
    <div style="display:flex">
      <ContainerRelative v-bind:width="512" v-bind:height="480">
        <MouseGrid
          v-bind:width="512"
          v-bind:height="480"
          v-bind:dimX="32"
          v-bind:dimY="30"
          v-on:leftClick="mousedown"
          v-on:leftDrag="mousedown"
          v-on:rightClick="eyedropper"
        />
        <Overlay
          v-bind:enabled="showOcurrences"
          v-bind:grid="currentTileUsage"
        />
        <PPUDisplay
          v-bind:characters="characters"
          v-bind:palettes="palettes"
          v-bind:nametable="nametable"
          v-bind:attributes="attributes"
        />
      </ContainerRelative>
      <div>
        <ChrTable
          v-bind:characters="characters"
          v-bind:palette="currentPalette"
          v-bind:value="chrSelect"
          v-on:input="selectTile"
          v-on:changeSelectSize="changeSelectSize"
          v-bind:selectWidth="selectWidth"
          v-bind:selectHeight="selectHeight"
        />
        <input type="checkbox" v-bind:data="showOcurrences" v-on:change="toggleShowOcurrences" id="showOcurrences"/>
        <label for="showOcurrences">Show ocurrences</label>
      </div>
    </div>
    <div>
      <select v-bind:data="selectedAttribute" v-on:input="selectAttribute($event.target.value)">
        <option v-for="(pal, index) in palettes" v-bind:value="index" v-bind:key="index">Palette {{index}}</option>
      </select>
      <input type="checkbox" v-bind:data="editAttribute" v-on:change="toggleEditAttribute" id="editAttribute"/>
      <label for="editAttribute">Attribute edit</label>
    </div>
  </div>
</template>

<script>
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
// needed because underscore is a parameter name in the lambdas below
import ChrTable from './ChrTable.vue'
import ContainerRelative from './common/ContainerRelative.vue'
import MouseGrid from './common/MouseGrid.vue'
import Overlay from './Overlay.vue'
import PPUDisplay from './PPUDisplay.vue'
import { mapState, mapMutations, mapGetters } from 'vuex'

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
  components: {
    ChrTable,
    MouseGrid,
    ContainerRelative,
    PPUDisplay,
    Overlay
  },
  methods: {
    ...mapMutations('data', ['setNametable', 'setAttribute']),
    ...mapMutations('nametableEditor', [
      'selectTile',
      'selectAttribute',
      'toggleEditAttribute',
      'toggleShowOcurrences',
      'changeSelectSize',
      'editNametable'
    ]),
    mousedown: function({row, col}) {
      if (this.editAttribute) {
        const which = row*32 + col;
        const attr = simpleAttrMap[which];
        this.setAttribute({ which: attr, value: this.selectedAttribute});
      } else {
        for (let i = 0; i < this.selectWidth; i++) {
          // stop if we are at the screen boundary
          if ((col + i) > 31) {
            continue;
          }
          for (let j = 0; j < this.selectHeight; j++) {
            // stop if we are at the screen boundary
            if ((row + j) > 29) {
              continue;
            }
            // which based on nametable size which is 32x30
            const which = (32 * (row + j)) + (col + i);
            // value based on the chrTable size which is 16x16
            const value = this.chrSelect + (16*j) + i;
            this.setNametable({ which, value });
          }
        }
      }
    },
    eyedropper: function({row, col}) {
      const which = row*32 + col;
      this.selectTile(this.nametable[which]);
    }
  },
  computed: {
    ...mapState('data', {
      characters: 'backgroundChr',
      nametable: 'nametable',
      attributes: 'attributes',
      palettes: 'backgroundColors'
    }),
    ...mapState('nametableEditor', [
      'selectedAttribute',
      'editAttribute',
      'showAttribute',
      'showOcurrences',
      'selectWidth',
      'selectHeight'
    ]),
    ...mapState('nametableEditor', {chrSelect: 'selectedTile'}),
    ...mapGetters('nametableEditor', ['currentPalette', 'currentTileUsage'])
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
