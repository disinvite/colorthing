<template>
  <div id="chrEditor">
    <PixelEditor
      v-bind:palette="currentPalette"
      v-bind:pixels="pixels"
      v-bind:selectedColor="colorInCurrentPalette"
      v-on:pixelChanged="pixelChanged"/>

    <Palette
      v-bind:colors="colors"
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
    pixels: {
      type: Array,
      default: new Array(64).fill(0)
    }
  },
  data: () => {
    return {
      NESCOLORS,
      palSelect: 0,
      colors: [0, 10, 20, 30, 0, 15, 25, 35]
    }
  },
  methods: {
    pixelChanged(newPix) {
      //this.pixels = newPix;
      this.$emit('chrUpdate', newPix);
    },
    selectColor(which) {
      this.palSelect = which;
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
