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
import { Serialize } from '../services/SceneObject'
import { bin_serializeChr, bin_serializeNametable } from '../services/BinaryFile'

export default {
  name: 'DataPanel',
  props: {
    allData: Object
  },
  methods: {
    doUpload: function(evt) {
      const files = evt.target.files || evt.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        this.$emit('dataLoad', e.target.result);
      };

      reader.readAsText(files[0]);
    },
    chrUpload: function(evt) {
      const files = evt.target.files || evt.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        this.$emit('chrLoad', e.target.result);
      };

      reader.readAsArrayBuffer(files[0]);
    },
    namUpload: function(evt) {
      const files = evt.target.files || evt.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        this.$emit('namLoad', e.target.result);
      };

      reader.readAsArrayBuffer(files[0]);
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
      const jsonString = Serialize(this.allData);
      const blob = new Blob([jsonString], {type: "application/json; charset=utf-8"});
      const url = window.URL.createObjectURL(blob);
      const a = this.$refs['download'];
      a.href = url;
      a.download = 'my-file.json';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    chrSave: function() {
      const dataArray = bin_serializeChr(this.allData.backgroundChr);
      const blob = new Blob([dataArray], {type: "application/x-binary; charset=utf-8"});
      const url = window.URL.createObjectURL(blob);
      const a = this.$refs['download'];
      a.href = url;
      a.download = 'my-file.chr';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    namSave: function() {
      const dataArray = bin_serializeNametable(this.allData.nametable, this.allData.attributes);
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
