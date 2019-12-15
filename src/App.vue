<template>
  <div id="app">
    <div>
      <h1>hi there</h1>
      <p>selected chr is: {{ selectedChr }}</p>
    </div>
    <div class="container">
      <div style="vertical-align: top;">
        <ChrEditor
          v-bind:pixels="chr[selectedChr]"
          v-bind:colors="colors"
          v-on:chrUpdate="chrUpdate"
          v-on:palSelect="palSelect = $event"
        />
      </div>
      <div style="vertical-align: top;">
        <ChrTable
          v-bind:characters="chr"
          v-bind:palette="currentPalette"
          v-model="selectedChr"
        />
      </div>
      <div style="vertical-align: top;">
        <div>
          <input v-model="serializedData" style="font-size: 16pt;" />
          <button v-on:click="dataLoad" style="font-size: 16pt;">Data load</button>
        </div>
        <AliasTable v-model="aliases" />
      </div>
    </div>
  </div>
</template>

<script>
import ChrEditor from './components/ChrEditor.vue'
import ChrTable from './components/ChrTable.vue'
import AliasTable from './components/AliasTable.vue'
import { Serialize, Deserialize } from './services/DataTransfer'

export default {
  name: 'app',
  data: function() {
    const chr = new Array(256);
    for(let i = 0; i < 256; i++) {
      chr[i] = new Array(64).fill(0);
    }
    const colors = [13, 3, 19, 35, 13, 10, 26, 42];

    const aliases = {};

    return {
      serializedData: '{}',
      chr,
      colors,
      aliases,
      palSelect: 0,
      selectedChr: 0
    }
  },
  methods: {
    chrUpdate(newChr) {
      this.chr[this.selectedChr] = newChr;
    },
    dataLoad() {
      const data = Deserialize(this.serializedData);
      this.chr = data.chr;
      this.colors = data.colors;
      this.aliases = data.aliases;
    }
  },
  watch: {
    chr: function() {
      this.serializedData = Serialize(this.chr, this.colors, this.aliases);
    },
    colors: function() {
      this.serializedData = Serialize(this.chr, this.colors, this.aliases);
    },
    aliases: function() {
      this.serializedData = Serialize(this.chr, this.colors, this.aliases);
    }
  },
  computed: {
    currentPalette: function() {
      const start = Math.floor(this.palSelect / 4) * 4;
      return this.colors.slice(start, start + 4);
    }
  },
  components: {
    ChrEditor,
    ChrTable,
    AliasTable
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
.container {
  display: flex;
}
</style>
