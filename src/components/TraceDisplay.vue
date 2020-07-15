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
    alpha: String
  },
  computed: {
    styleObj: function() {
      return {
        background: `url('${this.imageData}')`,
        backgroundSize: `${this.scale * 100}%`,
        backgroundPosition: `${this.position.x}% ${this.position.y}%`,
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
