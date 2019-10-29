<template>
  <div id="app">
    <h1>hi there</h1>
    <PixelEditor />

    <p>The color is <b v-bind:style="{ color: NESCOLORS[selectedColor] }">{{ selectedColor }}</b></p>
    <ColorPicker v-model="selectedColor" />
    
  </div>
</template>

<script>
import ColorPicker from './components/ColorPicker.vue'
import PixelEditor from './components/PixelEditor.vue'
import { NESCOLORS } from './Constants'

export default {
  name: 'app',
  data: () => {
    return {
      NESCOLORS,
      selectedColor: 5
    }
  },
  components: {
    ColorPicker,
    PixelEditor
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
