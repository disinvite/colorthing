<template>
  <div v-bind:style="styleObj">&nbsp;</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TraceDisplay',
  computed: {
    ...mapState('chrEditor/tracer', [
      'enabled',
      'imageData',
      'imageWidth',
      'imageHeight',
      'scale',
      'offsetX',
      'offsetY',
      'alpha',
      'pixelMode'
    ]),
    styleObj: function() {
      const scale = this.pixelMode ? 24 : this.scale;

      return {
        background: `url('${this.imageData}')`,
        backgroundSize: `${this.imageWidth * scale}px ${this.imageHeight * scale}px`,
        backgroundPosition: `${-this.offsetX * scale}px ${-this.offsetY * scale}px`,
        opacity: this.enabled ? (this.alpha / 100.0) : 0,
        imageRendering: this.pixelMode ? 'pixelated' : 'auto'
      }
    }
  }
}
</script>

<style scoped>
div {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -75;
}
</style>
