<template>
  <div v-if="enabled">
    <ImageUpload v-on:upload="tracerUpload" />
    <div>
      <input type="range" min="0.1" max="10.0" step="0.1"
        v-bind:value="scale" v-on:input="setScale($event.target.value)" />
      <span>scale: {{scale}}x</span>
    </div>
    <div>
      <input type="range" min="0" v-bind:max="imageWidth" step="100"
        v-bind:value="offsetX" v-on:input="setOffsetX($event.target.value)" />
      <input type="number" v-bind:value="offsetX" v-on:input="setOffsetX($event.target.value)" />
      <span>x: {{offsetX}}px</span>
    </div>
    <div>
      <input type="range" min="0" v-bind:max="imageHeight" step="100"
        v-bind:value="offsetY" v-on:input="setOffsetY($event.target.value)" />
      <input type="number" v-bind:value="offsetY" v-on:input="setOffsetY($event.target.value)" />
      <span>y: {{offsetY}}px</span>
    </div>
    <div>
      <input type="range" min="0" max="100" step="10"
        v-bind:value="alpha" v-on:input="setAlpha($event.target.value)" />
      <span>alpha: {{ alpha }}%</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ImageUpload from './common/ImageUpload.vue'

export default {
  name: 'TraceOptions',
  components: {
    ImageUpload
  },
  computed: {
    ...mapState('chrEditor/tracer', [
      'enabled',
      'imageWidth',
      'imageHeight',
      'scale',
      'offsetX',
      'offsetY',
      'alpha'
    ])
  },
  methods: {
    ...mapMutations('chrEditor/tracer', [
      'setDataUrl',
      'setImageDimensions',
      'setScale',
      'setOffsetX',
      'setOffsetY',
      'setAlpha'
    ]),
    tracerUpload({ dataUrl, width, height }) {
      this.setDataUrl(dataUrl);
      this.setImageDimensions({width, height});
    }
  }
}
</script>

<style scoped>
</style>
