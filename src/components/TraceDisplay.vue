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
      'alpha'
    ]),
    styleObj: function() {
      return {
        background: `url('${this.imageData}')`,
        backgroundSize: `${this.imageWidth * this.scale}px ${this.imageHeight * this.scale}px`,
        backgroundPosition: `${-this.offsetX * this.scale}px ${-this.offsetY * this.scale}px`,
        opacity: this.enabled ? (this.alpha / 100.0) : 0
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
