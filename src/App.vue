<template>
  <div id="app">
    <div class="container">
      <NametableEditor />
    </div>
    <hr />
    <div class="container">
      <div style="vertical-align: top;">
        <ChrEditor />
      </div>
      <DataPanel />
    </div>
  </div>
</template>

<script>
import ChrEditor from './components/ChrEditor.vue'
import NametableEditor from './components/NametableEditor.vue'
import DataPanel from './components/DataPanel.vue'

export default {
  name: 'app',
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
