<template>
  <div v-bind:style="styleObj">&nbsp;</div>
</template>

<script>
export default {
  name: 'TraceDisplay',
  props: {
    enabled: Boolean,
    imageData: String,
    scale: String,
    position: Object,
    alpha: String,
    width: Number,
    height: Number
  },
  computed: {
    styleObj: function() {
      return {
        background: `url('${this.imageData}')`,
        backgroundSize: `${this.width * this.scale}px ${this.height * this.scale}px`,
        backgroundPosition: `-${this.position.x * this.scale}px -${this.position.y * this.scale}px`,
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
