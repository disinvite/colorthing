<template>
  <ul>
    <li v-for="(cell, index) in pixels"
      v-bind:key="index"
      v-bind:style="{ backgroundColor: NESCOLORS[cell] }"
      v-on:click="pixel(index)">&nbsp;</li>
  </ul>
</template>

<script>
import { NESCOLORS } from '../Constants';

export default {
  name: 'PixelEditor',
  props: {
    value: String,
    palette: Array
  },
  methods: {
    pixel(which) {
      const currentVal = this.pixels[which];
      this.$set(this.pixels, which, currentVal === 0 ? 1 : 0);
    },
    whichColor(which) {
      return NESCOLORS[ this.pixels[which] ];
    }
  },
  data: () => {
    return {
      NESCOLORS,
      pixels: Array(64).fill(0)
    };
  }
}
</script>

<style scoped>
ul {
  border: 0 solid #eee;
  border-width: 0 0 1px 1px;

  list-style: none;
  width: 320px;
  padding-left: 0;
}
li {
  border: 0 solid #eee;
  border-width: 1px 1px 0 0;

  user-select: none;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  display: inline-block;
  text-align: center;
  height: 40px;
  width: 40px;
  line-height: 40px;
  color: white;
  vertical-align: middle;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}
</style>
