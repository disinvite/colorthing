<template>
  <div v-bind:style="styleObj">&nbsp;</div>
</template>

<script>
export default {
  name: 'SelectorDisplay',
  props: {
    selectWidth: Number,
    selectHeight: Number,
    value: Number
  },
  computed: {
    styleObj() {
      return {
        top: `${Math.floor(this.value / 16) * 24}px`,
        left: `${(this.value % 16) * 24}px`,
        width: `${24 * this.selectWidth}px`,
        height: `${24 * this.selectHeight}px`,
        lineHeight: `${24 * this.selectHeight}px`
      }
    }
  }
}
</script>

<style scoped>
div {
  pointer-events: none; /* not a possible click target */
  position: absolute;
  display: inline-block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  vertical-align: middle;
  border: 3px white double;
}
</style>
