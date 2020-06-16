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
    <div>
      <h1>hi there</h1>
      <p>selected chr is: {{ selectedChr }}</p>
    </div>
    <div class="container">
      <div style="vertical-align: top;">
        <ChrEditor
          v-bind:characters="pixels"
          v-bind:colors="scene.backgroundColors"
          v-on:pixelChanged="pixelChanged"
          v-on:palSelect="palSelect = $event"
        />
      </div>
      <div style="vertical-align: top;">
        <ChrTable
          v-bind:characters="scene.backgroundChr"
          v-bind:palette="currentPalette"
          v-model="selectedChr"
          v-bind:selectSize="2"
        />
      </div>
      <div style="vertical-align: top;">
        <div>
          <input v-model="serializedData" style="font-size: 16pt;" />
          <button v-on:click="dataLoad" style="font-size: 16pt;">Data load</button>
          <button v-on:click="dataSave" style="font-size: 16pt;">Data save</button>
        </div>
        <AliasTable v-model="aliases" />
      </div>
    </div>
  </div>
</template>

<script>
import ChrEditor from './components/ChrEditor.vue'
import ChrTable from './components/ChrTable.vue'
import NametableEditor from './components/NametableEditor.vue'
import AliasTable from './components/AliasTable.vue'
import { EmptyObject, Serialize, Deserialize } from './services/SceneObject'

export default {
  name: 'app',
  data: function() {
    const scene = EmptyObject();
    scene.backgroundColors[0] = [13, 3, 19, 35];
    scene.backgroundColors[1] = [13, 10, 26, 42];
    scene.backgroundColors[2] = [13, 4, 20, 36];
    scene.backgroundColors[3] = [13, 0, 16, 32];

    const aliases = {};

    return {
      serializedData: null,
      scene,
      aliases,
      palSelect: 0,
      selectedChr: 0,
      ntSelectedChr: 0,
    }
  },
  methods: {
    pixelChanged([_whichChr, whichPix, color]) {
      const whichChr = this.selectedChr + (_whichChr%2) + (16*Math.floor(_whichChr/2))
      const tmp = this.scene.backgroundChr[whichChr];
      tmp[whichPix] = color;
      this.$set(this.scene.backgroundChr, whichChr, tmp);
    },
    dataSave() {
      this.serializedData = Serialize(this.scene);
    },
    dataLoad() {
      const data = Deserialize(this.scene, this.serializedData);
      Object.assign(this.scene, data);
      //this.aliases = data.aliases;
    }
  },
  computed: {
    currentPalette: function() {
      return this.scene.backgroundColors[this.palSelect];
    },
    pixels: function() {
      return [
        this.scene.backgroundChr[this.selectedChr],
        this.scene.backgroundChr[this.selectedChr + 1],
        this.scene.backgroundChr[this.selectedChr + 16],
        this.scene.backgroundChr[this.selectedChr + 17]
      ];
    }
  },
  components: {
    ChrEditor,
    ChrTable,
    AliasTable,
    NametableEditor
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
