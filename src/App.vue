<template>
  <div id="app">
    <h1>hi there</h1>
    <PixelEditor
      v-bind:palette="pal1" />

    <Palette
      v-model="pal1"
      v-on:select="selectColor"
    />
    <p>The color is <b v-bind:style="{ color: NESCOLORS[selectedColor] }">{{ selectedColor }}</b></p>
    <ColorPicker
      v-bind:color="this.selectedColor"
      v-on:colorChange="colorChange"
    />
    
  </div>
</template>

<script>
import ColorPicker from './components/ColorPicker.vue'
import PixelEditor from './components/PixelEditor.vue'
import Palette from './components/Palette.vue'
import { NESCOLORS } from './Constants'

export default {
  name: 'app',
  data: () => {
    return {
      NESCOLORS,
      selectedColor: 0,
      palSelect: 0,
      pal1: [0, 10, 20, 30]
    }
  },
  methods: {
    selectColor(which) {
      this.palSelect = which;
      this.selectedColor = this.pal1[which];
    },
    colorChange(which) {
      this.$set(this.pal1, this.palSelect, which);
    }
  },
  components: {
    ColorPicker,
    PixelEditor,
    Palette
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
