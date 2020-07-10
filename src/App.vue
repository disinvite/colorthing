<template>
  <div id="app">
    <div class="container">
      <NametableEditor 
        v-bind:characters="scene.backgroundChr"
        v-bind:palettes="scene.backgroundColors"
        v-bind:nametable="scene.nametable"
        v-bind:attributes="scene.attributes"
        v-on:nametableChange="scene.nametable.splice(0, 960, ...$event)"
        v-on:attributeChange="scene.attributes.splice(0, 256, ...$event)"
      />
    </div>
    <hr />
    <div class="container">
      <div style="vertical-align: top;">
        <ChrEditor
          v-bind:characters="scene.backgroundChr"
          v-bind:colors="scene.backgroundColors"
          v-on:pixelChanged="pixelChanged"
          v-on:palSelect="palSelect = $event"
        />
      </div>
      <DataPanel
        v-bind:allData="scene"
        v-on:dataLoad="dataLoad"
        v-on:chrLoad="chrLoad"
        v-on:namLoad="namLoad"
      />
    </div>
  </div>
</template>

<script>
import ChrEditor from './components/ChrEditor.vue'
import NametableEditor from './components/NametableEditor.vue'
import DataPanel from './components/DataPanel.vue'
import { EmptyObject, Deserialize } from './services/SceneObject'
import { bin_deserializeChr, bin_deserializeNametable } from './services/BinaryFile'

export default {
  name: 'app',
  data: function() {
    const scene = EmptyObject();
    scene.backgroundColors[0] = [13, 3, 19, 35];
    scene.backgroundColors[1] = [13, 10, 26, 42];
    scene.backgroundColors[2] = [13, 4, 20, 36];
    scene.backgroundColors[3] = [13, 0, 16, 32];

    return {
      scene,
      palSelect: 0,
      ntSelectedChr: 0,
    }
  },
  methods: {
    pixelChanged([whichChr, whichPix, color]) {
      const tmp = this.scene.backgroundChr[whichChr];
      tmp[whichPix] = color;
      this.$set(this.scene.backgroundChr, whichChr, tmp);
    },
    dataLoad(jsonString) {
      const data = Deserialize(this.scene, jsonString);
      Object.assign(this.scene, data);
    },
    chrLoad(chrBin) {
      const chrArray = bin_deserializeChr(chrBin);
      this.scene.backgroundChr.splice(0, 256, ...chrArray);
    },
    namLoad(namBin) {
      const {tileArray, attrArray} = bin_deserializeNametable(namBin);
      this.scene.nametable.splice(0, 960, ...tileArray);
      this.scene.attributes.splice(0, 256, ...attrArray);
    }
  },
  computed: {
    currentPalette: function() {
      return this.scene.backgroundColors[this.palSelect];
    }
  },
  components: {
    ChrEditor,
    NametableEditor,
    DataPanel
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
