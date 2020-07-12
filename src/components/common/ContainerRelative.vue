<template>
  <div v-bind:style="styleObj">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ContainerRelative',
  props: {
    width: Number,
    height: Number
  },
  computed: {
    styleObj: function() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }
  }
}
</script>

<style scoped>
div {
  position: relative;
}
</style>
