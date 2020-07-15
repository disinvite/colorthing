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
        <TraceDisplay
          v-bind:enabled="tracerEnabled"
          v-bind:imageData="imageData"
          v-bind:scale="traceScale"
          v-bind:position="tracePosition"
          v-bind:alpha="traceAlpha"
        />
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
        <div v-if="tracerEnabled">
          <ImageUpload v-on:upload="imageData = $event" />
          <div>
            <input type="range" min="0.5" max="2.0" step="0.1" v-model="traceScale" />
            <span>scale: {{traceScale}}x</span>
          </div>
          <div>
            <input type="range" min="0" max="100" step="16.666" v-model="tracePosition.x" />
            <span>x: {{tracePosition.x}}%</span>
          </div>
          <div>
            <input type="range" min="0" max="100" step="16.666" v-model="tracePosition.y" />
            <span>y: {{tracePosition.y}}%</span>
          </div>
          <div>
            <input type="range" min="0" max="100" step="10" v-model="traceAlpha" />
            <span>alpha: {{traceAlpha}}%</span>
          </div>
        </div>
      </div>
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
import TraceDisplay from './TraceDisplay.vue'
import ImageUpload from './common/ImageUpload.vue'
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
      'toggleTracerEnabled'
    ]),
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
      colorSelect: 'selectedColor',
      tracerEnabled: 'tracerEnabled'
    }),
    ...mapGetters('chrEditor', ['currentPalette'])
  },
  data() {
    return {
      imageData: '',
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
    ImageUpload
  }
}
</script>

<style scoped>
div#chrEditor {
  display: inline-block;
}
</style>
