<template>
  <div>
    <ul id="grid">
      <li v-for="(cell, index) in pixels"
        v-bind:key="index"
        v-bind:style="{ backgroundColor: NESCOLORS[palette[cell]] }"
        v-on:click="pixel(index)">&nbsp;</li>
    </ul>
    <ul id="palette">
      <li v-for="(color, index) in palette"
        v-bind:style="{ backgroundColor: NESCOLORS[color] }"
        v-bind:class="{ selected: (index === selectedColor) }"
        v-on:click="selectedColor = index"
        v-bind:key="index">&nbsp;</li>
    </ul>
    <br style="clear:both;"/>
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
    }
  },
  methods: {
    pixel(which) {
      const currentVal = this.pixels[which];
      this.$set(this.pixels, which, currentVal === 0 ? this.selectedColor : 0);
      this.$emit('pixelChanged', this.pixels);
    },
    whichColor(which) {
      return NESCOLORS[ this.pixels[which] ];
    }
  },
  data: () => {
    return {
      NESCOLORS,
      selectedColor: 0
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
  float: left;
  width: 320px;
}
ul#palette {
  margin-left: 40px;
  float: left;
  width: 40px;
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
