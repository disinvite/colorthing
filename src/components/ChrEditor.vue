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
        v-bind:editorZoom="editorZoom">
        <TraceDisplay />
      </PixelEditor>

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

    <div style="display:flex">
      <Palette
        v-bind:palettes="colors"
        v-bind:selectedPalette="palSelect"
        v-bind:selectedColor="colorSelect"
        v-on:select="selectColor"
      />
      <div>
        <input type="checkbox" v-bind:value="tracerEnabled" v-on:change="toggleTracerEnabled" id="tracerEnabled"/>
        <label for="tracerEnabled">Tracer</label>
      </div>
      <TraceOptions />
    </div>
    <ColorPicker
      v-model="colors[palSelect][colorSelect]"
    />
  </div>
</template>

<script>
import ChrTable from './ChrTable.vue'
import ColorPicker from './ColorPicker.vue'
import PixelEditor from './PixelEditor.vue'
import TraceOptions from './TraceOptions.vue'
import TraceDisplay from './TraceDisplay.vue'
import Palette from './Palette.vue'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'ChrEditor',
  methods: {
    ...mapMutations('chrEditor', [
      'selectTile',
      'selectColor',
      'selectColorOnly',
      'setZoom',
    ]),
    ...mapMutations('chrEditor/tracer', {
      toggleTracerEnabled: 'toggleEnabled'
    }),
    ...mapMutations('data', ['setChr']),
    tracerUpload(obj) {
      this.imageData = obj.data;
      this.imageWidth = obj.width;
      this.imageHeight = obj.height;
      Object.assign(this.tracePosition, {x:0, y:0});
    }
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
    ...mapState('chrEditor/tracer', {
      tracerEnabled: 'enabled'
    }),
    ...mapGetters('chrEditor', ['currentPalette'])
  },
  data() {
    return {
      imageData: '',
      imageWidth: 0,
      imageHeight: 0,
      traceScale: 1,
      tracePosition: {x:0, y:0},
      traceAlpha: 50
    }
  },
  components: {
    ChrTable,
    ColorPicker,
    PixelEditor,
    Palette,
    TraceDisplay,
    TraceOptions
  }
}
</script>

<style scoped>
div#chrEditor {
  display: inline-block;
}
</style>
