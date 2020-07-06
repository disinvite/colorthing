<template>
  <div>
    <h1>I/O Area</h1>
    <button v-on:click="dataLoad">Load from file</button>
    <button v-on:click="dataSave">Save to file</button>
    <input type="file" ref="upload" accept="application/json" style="display:none"
      v-on:change="doUpload">
    <a ref="download" style="display: none" />
  </div>
</template>

<script>
import { Serialize } from '../services/SceneObject'

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

      console.log(files);

      const reader = new FileReader();
      reader.onload = e => {
        console.log(e);
        this.$emit('dataLoad', e.target.result);
      };

      reader.readAsText(files[0]);
    },
    dataLoad: function() {
      this.$refs['upload'].click();
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
    }
  }
}
</script>

<style scoped>
button {
  font-size: 16pt;
}
</style>
