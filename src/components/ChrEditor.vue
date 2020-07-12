<template>
  <div id="chrEditor">
    <h1>CHR Editor</h1>
    <p>selected chr is: {{ selectedChr }}</p>
    <div style="display:flex">
      <PixelEditor
        v-bind:palette="currentPalette"
        v-bind:characters="characters"
        v-bind:topLeftChr="selectedChr"
        v-bind:selectedColor="colorSelect"
        v-on:eyedropper="selectColorOnly"
        v-on:setChr="setChr"
        v-bind:editorZoom="editorZoom"/>

      <ChrTable
        v-bind:characters="characters"
        v-bind:palette="currentPalette"
        v-bind:value="selectedChr"
        v-on:input="selectTile"
        v-bind:selectSize="editorZoom"
      />
    </div>
    <div>
      <select v-bind:value="editorZoom" v-on:input="setZoom($event.target.value)">
        <option value=1>1x1</option>
        <option value=2>2x2</option>
        <option value=4>4x4</option>
      </select>
    </div>

    <Palette
      v-bind:palettes="colors"
      v-bind:selectedPalette="palSelect"
      v-bind:selectedColor="colorSelect"
      v-on:select="selectColor"
    />
    <ColorPicker
      v-model="colors[palSelect][colorSelect]"
    />
  </div>
</template>

<script>
import ChrTable from './ChrTable.vue'
import ColorPicker from './ColorPicker.vue'
import PixelEditor from './PixelEditor.vue'
import Palette from './Palette.vue'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'ChrEditor',
  methods: {
    ...mapMutations('chrEditor', ['selectTile', 'selectColor', 'selectColorOnly', 'setZoom']),
    ...mapMutations('data', ['setChr'])
  },
  computed: {
    ...mapState('data', {
      characters: 'backgroundChr',
      colors: 'backgroundColors'
    }),
    ...mapState('chrEditor', {
      editorZoom: 'zoom',
      selectedChr: 'selectedTile',
      palSelect: 'selectedPalette',
      colorSelect: 'selectedColor'
    }),
    ...mapGetters('chrEditor', ['currentPalette'])
  },
  components: {
    ChrTable,
    ColorPicker,
    PixelEditor,
    Palette
  }
}
</script>

<style scoped>
div#chrEditor {
  display: inline-block;
}
</style>
