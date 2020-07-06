<template>
  <div id="app">
    <div class="container">
      <NametableEditor 
        v-bind:characters="scene.backgroundChr"
        v-bind:chrSelect="ntSelectedChr"
        v-bind:palettes="scene.backgroundColors"
        v-bind:nametable="scene.nametable"
        v-bind:attributes="scene.attributes"
        v-on:nametableChange="scene.nametable = $event"
        v-on:attributeChange="scene.attributes = $event"
      />
      <ChrTable
        v-bind:characters="scene.backgroundChr"
        v-bind:palette="currentPalette"
        v-model="ntSelectedChr"
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
      />
    </div>
  </div>
</template>

<script>
import ChrEditor from './components/ChrEditor.vue'
import ChrTable from './components/ChrTable.vue'
import NametableEditor from './components/NametableEditor.vue'
import DataPanel from './components/DataPanel.vue'
import { EmptyObject, Deserialize } from './services/SceneObject'

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
    }
  },
  computed: {
    currentPalette: function() {
      return this.scene.backgroundColors[this.palSelect];
    }
  },
  components: {
    ChrEditor,
    ChrTable,
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
