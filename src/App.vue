<template>
  <div id="app">
    <h1>hi there</h1>
    <p>selected chr is: {{ selectedChr }}</p>
    <div style="display: inline-block; vertical-align: top;">
      <ChrEditor
        v-bind:pixels="chr[selectedChr]"
        v-bind:colors="colors"
        v-on:colorChange="colorChange"
        v-on:chrUpdate="chrUpdate"
      />
    </div>
    <div style="display: inline-block;  vertical-align: top;">
      <ChrTable
        v-bind:characters="chr"
        v-model="selectedChr"
      />
    </div>
    <input v-model="serializedData" style="font-size: 16pt;" />
  </div>
</template>

<script>
import ChrEditor from './components/ChrEditor.vue'
import ChrTable from './components/ChrTable.vue'
import { Serialize } from './services/DataTransfer'

export default {
  name: 'app',
  data: function() {
    const chr = new Array(16);
    for(let i = 0; i < 16; i++) {
      chr[i] = new Array(64).fill(0);
    }

    return {
      serializedData: '{}',
      chr,
      colors: [13, 3, 19, 35, 13, 10, 26, 42],
      selectedChr: 0
    }
  },
  methods: {
    chrUpdate(newChr) {
      this.chr[this.selectedChr] = newChr;
    },
    colorChange(newColors) {
      this.colors = newColors;
    }
  },
  watch: {
    chr: function() {
      this.serializedData = Serialize(this.chr, this.colors);
    },
    colors: function() {
      this.serializedData = Serialize(this.chr, this.colors);
    }
  },
  components: {
    ChrEditor,
    ChrTable
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
