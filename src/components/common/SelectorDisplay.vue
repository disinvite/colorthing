<template>
  <div
    v-bind:style="{top: `${Math.floor(value / 16) * 24}px`, left: `${(value % 16) * 24}px`}"
    v-bind:class="{x2: selectSize == 2, x4: selectSize == 4}"
  >&nbsp;</div>
</template>

<script>
export default {
  name: 'SelectorDisplay',
  props: {
    selectSize: Number,
    value: Number
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
  /* x1 */
  line-height: 24px;
  width: 24px;
  height: 24px;
}
.x2 {
  line-height: 48px;
  width: 48px;
  height: 48px;
}
.x4 {
  line-height: 96px;
  width: 96px;
  height: 96px;
}
</style>
