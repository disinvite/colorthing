<template>
  <div id="app">
    <h1>hi there</h1>
    <PixelEditor
      v-bind:palette="pal1"
      v-bind:pixels="pixels"
      v-bind:selectedColor="palSelect"
      v-on:pixelChanged="pixelChanged"/>

    <Palette
      v-model="pal1"
      v-on:select="selectColor"
    />
    <Preview 
      v-bind:image="pixels"
      v-bind:palette="pal1"
    />
    <ColorPicker
      v-model="pal1[palSelect]"
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
      pal1: [0, 10, 20, 30]
    }
  },
  methods: {
    pixelChanged(newPix) {
      this.pixels = newPix;
    },
    selectColor(which) {
      this.palSelect = which;
    },
    colorChange(which) {
      this.$set(this.pal1, this.palSelect, which);
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
