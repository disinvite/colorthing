<template>
  <div id="app">
    <h1>hi there</h1>
    <PixelEditor
      v-bind:palette="currentPalette"
      v-bind:pixels="pixels"
      v-bind:selectedColor="colorInCurrentPalette"
      v-on:pixelChanged="pixelChanged"/>

    <Palette
      v-bind:colors="colors"
      v-on:select="selectColor"
    />
    <Preview 
      v-bind:image="pixels"
      v-bind:palette="currentPalette"
    />
    <ColorPicker
      v-model="colors[palSelect]"
    />
    
  </div>
</template>

<script>
import ColorPicker from './components/ColorPicker.vue'
import PixelEditor from './components/PixelEditor.vue'
import Palette from './components/Palette.vue'
import Preview from './components/Preview.vue'
import { NESCOLORS } from './Constants'

export default {
  name: 'app',
  data: () => {
    return {
      NESCOLORS,
      pixels: new Array(64).fill(0),
      palSelect: 0,
      colors: [0, 10, 20, 30, 0, 15, 25, 35]
    }
  },
  methods: {
    pixelChanged(newPix) {
      this.pixels = newPix;
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
    Palette,
    Preview
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
