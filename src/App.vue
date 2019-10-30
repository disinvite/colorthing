<template>
  <div id="app">
    <h1>hi there</h1>
    <p>selected chr is: {{ selectedChr }}</p>
    <div style="display: inline-block; vertical-align: top;">
      <ChrEditor
        v-bind:pixels="chr[selectedChr]"
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
      pal: [0, 10, 20, 30],
      selectedChr: 0
    }
  },
  methods: {
    chrUpdate(newChr) {
      this.chr[this.selectedChr] = newChr;
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
