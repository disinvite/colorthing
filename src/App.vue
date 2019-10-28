<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <p>The color is <b v-bind:style="{ color: NESCOLORS[selectedColor] }">{{ selectedColor }}</b></p>
    <p>The other color is <b v-bind:style="{ color: NESCOLORS[alternateColor] }">{{ alternateColor }}</b></p>
    <ColorPicker v-model="selectedColor" />
    <ColorPicker v-model="alternateColor" />
  </div>
</template>

<script>
import ColorPicker from './components/ColorPicker.vue'
import { NESCOLORS } from './Constants'

export default {
  name: 'app',
  data: () => {
    return {
      NESCOLORS,
      selectedColor: 5,
      alternateColor: 0
    }
  },
  components: {
    ColorPicker
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
