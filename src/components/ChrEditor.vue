<template>
  <div id="chrEditor">
    <PixelEditor
      v-bind:palette="currentPalette"
      v-bind:characters="characters"
      v-bind:selectedColor="colorInCurrentPalette"
      v-on:eyedropper="eyedropper"
      v-on:pixelChanged="pixelChanged"/>

    <Palette
      v-bind:colors="colors"
      v-bind:selectedColor="palSelect"
      v-on:select="selectColor"
    />
    <ColorPicker
      v-model="colors[palSelect]"
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
    colors: Array
  },
  data: () => {
    return {
      NESCOLORS,
      palSelect: 0,
    }
  },
  methods: {
    pixelChanged(value) {
      this.$emit('pixelChanged', value);
    },
    eyedropper(which) {
      const start = Math.floor(this.palSelect / 4) * 4;
      this.palSelect = start + which;
      this.$emit('palSelect', this.palSelect);
    },
    selectColor(which) {
      this.palSelect = which;
      this.$emit('palSelect', this.palSelect);
    }
  },
  computed: {
    currentPalette: function() {
      const start = Math.floor(this.palSelect / 4) * 4;
      return this.colors.slice(start, start + 4);
    },
    colorInCurrentPalette: function() {
      return this.palSelect % 4;
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
