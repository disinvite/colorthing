<template>
  <div id="chrEditor">
    <PixelEditor
      v-bind:palette="currentPalette"
      v-bind:characters="characters"
      v-bind:topLeftChr="topLeftChr"
      v-bind:selectedColor="colorSelect"
      v-on:eyedropper="eyedropper"
      v-on:pixelChanged="pixelChanged"/>

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
import ColorPicker from './ColorPicker.vue'
import PixelEditor from './PixelEditor.vue'
import Palette from './Palette.vue'
import { NESCOLORS } from '../Constants'

export default {
  name: 'ChrEditor',
  props: {
    characters: Array,
    colors: Array,
    topLeftChr: Number
  },
  data: () => {
    return {
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
