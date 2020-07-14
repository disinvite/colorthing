<template>
  <div>
    <h1>I/O Area</h1>
    <button v-on:click="dataLoad">Load JSON</button>
    <button v-on:click="dataSave">Save JSON</button>
    <br/>
    <button v-on:click="namLoad">Load Nametable</button>
    <button v-on:click="namSave">Save Nametable</button>
    <br/>
    <button v-on:click="chrLoad">Load CHR</button>
    <button v-on:click="chrSave">Save CHR</button>
    <input type="file" ref="json-upload" accept="application/json" style="display:none" v-on:change="doUpload">
    <input type="file" ref="chr-upload" accept="application/x-binary" style="display:none" v-on:change="chrUpload">
    <input type="file" ref="nam-upload" accept="application/x-binary" style="display:none" v-on:change="namUpload">
    <a ref="download" style="display: none" />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'DataPanel',
  props: {
    allData: Object
  },
  computed: {
    ...mapGetters('data', ['serializeToJSON', 'serializeNametableToBinary', 'serializeChrToBinary'])
  },
  methods: {
    ...mapMutations('data', ['deserializeFromJSON', 'deserializeNametableFromBinary', 'deserializeChrFromBinary']),
    doUpload(evt) {
      const files = evt.target.files || evt.dataTransfer.files;
      if (!files.length) { return; }

      const reader = new FileReader();
      reader.onload = e => this.deserializeFromJSON(e.target.result)

      reader.readAsText(files[0]);
      evt.target.value = '';
    },
    chrUpload(evt) {
      const files = evt.target.files || evt.dataTransfer.files;
      if (!files.length) { return; }

      const reader = new FileReader();
      reader.onload = e => this.deserializeChrFromBinary(e.target.result)
      
      reader.readAsArrayBuffer(files[0]);
      evt.target.value = '';
    },
    namUpload(evt) {
      const files = evt.target.files || evt.dataTransfer.files;
      if (!files.length) { return; }

      const reader = new FileReader();
      reader.onload = e => this.deserializeNametableFromBinary(e.target.result)
      
      reader.readAsArrayBuffer(files[0]);
      evt.target.value = '';
    },
    dataLoad: function() {
      this.$refs['json-upload'].click();
    },
    chrLoad: function() {
      this.$refs['chr-upload'].click();
    },
    namLoad: function() {
      this.$refs['nam-upload'].click();
    },
    dataSave: function() {
      const jsonString = this.serializeToJSON
      const blob = new Blob([jsonString], {type: "application/json; charset=utf-8"});
      const url = window.URL.createObjectURL(blob);
      const a = this.$refs['download'];
      a.href = url;
      a.download = 'my-file.json';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    chrSave: function() {
      const dataArray = this.serializeChrToBinary;
      const blob = new Blob([dataArray], {type: "application/x-binary; charset=utf-8"});
      const url = window.URL.createObjectURL(blob);
      const a = this.$refs['download'];
      a.href = url;
      a.download = 'my-file.chr';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    namSave: function() {
      const dataArray = this.serializeNametableToBinary;
      const blob = new Blob([dataArray], {type: "application/x-binary; charset=utf-8"});
      const url = window.URL.createObjectURL(blob);
      const a = this.$refs['download'];
      a.href = url;
      a.download = 'my-file.nam';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
</script>

<style scoped>
button {
  font-size: 16pt;
}
</style>
