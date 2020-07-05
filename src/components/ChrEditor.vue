<template>
  <div id="chrEditor">
    <h1>CHR Editor</h1>
    <p>selected chr is: {{ selectedChr }}</p>
    <div style="display:flex">
      <PixelEditor
        v-bind:palette="currentPalette"
        v-bind:characters="characters"
        v-bind:topLeftChr="selectedChr"
        v-bind:selectedColor="colorSelect"
        v-on:eyedropper="eyedropper"
        v-on:pixelChanged="pixelChanged"
        v-bind:editorZoom="editorZoom"/>

      <ChrTable
        v-bind:characters="characters"
        v-bind:palette="currentPalette"
        v-model="selectedChr"
        v-bind:selectSize="editorZoom"
      />
    </div>
    <div>
      <select v-model="editorZoom">
        <option value=1>1x1</option>
        <option value=2>2x2</option>
        <option value=4>4x4</option>
      </select>
    </div>

    <Palette
      v-bind:palettes="colors"
      v-bind:selectedPalette="palSelect"
      v-bind:selectedColor="colorSelect"
      v-on:select="selectColor"
    />
    <ColorPicker
      v-model="colors[palSelect][colorSelect]"
    />
  </div>
</template>

<script>
import ChrTable from './ChrTable.vue'
import ColorPicker from './ColorPicker.vue'
import PixelEditor from './PixelEditor.vue'
import Palette from './Palette.vue'
import { NESCOLORS } from '../Constants'

export default {
  name: 'ChrEditor',
  props: {
    characters: Array,
    colors: Array
  },
  data: () => {
    return {
      editorZoom: 2,
      selectedChr: 0,
      NESCOLORS,
      palSelect: 0,
      colorSelect: 0,
    }
  },
  methods: {
    pixelChanged(value) {
      this.$emit('pixelChanged', value);
    },
    eyedropper(value) {
      this.colorSelect = value;
      this.$emit('colorSelect', this.colorSelect);
    },
    selectColor([_pal, _color]) {
      this.palSelect = _pal;
      this.colorSelect = _color;
      this.$emit('palSelect', this.palSelect);
    }
  },
  computed: {
    currentPalette: function() {
      return this.colors[this.palSelect];
    }
  },
  components: {
    ChrTable,
    ColorPicker,
    PixelEditor,
    Palette
  }
}
</script>

<style scoped>
div#chrEditor {
  display: inline-block;
}
</style>
