<template>
  <div>
    <ul id="grid">
      <li v-for="(cell, index) in pixels"
        v-bind:key="index"
        v-bind:style="{ backgroundColor: NESCOLORS[palette[cell]] }"
        v-on:mousedown="mousedown(index)"
        v-on:mouseover="mouseover(index)"
        >&nbsp;</li>
    </ul>
  </div>
</template>

<script>
import { NESCOLORS } from '../Constants';

export default {
  name: 'PixelEditor',
  props: {
    pixels: {
      type: Array,
      default: () => new Array(64).fill(0)
    },
    palette: {
      type: Array,
      default: () => [0, 1, 2, 3]
    },
    selectedColor: {
      type: Number,
      default: () => 0
    }
  },
  created() {
    document.addEventListener('mouseup', () => this.clickHeld = false);
  },
  methods: {
    mousedown(which) {
      this.clickHeld = true;
      this.pixel(which)
    },
    mouseover(which) {
      if (this.clickHeld) {
        this.pixel(which);
      }
    },
    pixel(which) {
      this.$set(this.pixels, which, this.selectedColor);
      this.$emit('pixelChanged', this.pixels);
    }
  },
  data: () => {
    return {
      NESCOLORS,
      clickHeld: false
    };
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0;
}
ul#grid {
  border: 0 solid #eee;
  border-width: 0 0 1px 1px;
  width: 320px;
}
ul#grid li {
  border: 0 solid #eee;
  border-width: 1px 1px 0 0;
}
li {
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
li.selected {
  line-height: 34px; /* minus 6 */
  border: 3px white double;
}
</style>
