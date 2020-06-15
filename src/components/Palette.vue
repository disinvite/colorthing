<template>
  <div>
    <ul v-for="(colors, p_index) in palettes" v-bind:key="p_index">
      <li
        v-for="(color, c_index) in colors"
        v-bind:key="c_index"
        v-bind:style="{ backgroundColor: NESCOLORS[color] }"
        v-bind:class="{ selected: ((p_index === selectedPalette) && (c_index === selectedColor)) }"
        v-on:click="pickColor(p_index, c_index)">{{ colorText(p_index, c_index) }}</li>
    </ul>
  </div>
</template>

<script>
import { NESCOLORS } from '../Constants';

export default {
  name: 'Palette',
  props: {
    selectedPalette: Number,
    selectedColor: Number,
    palettes: {
      type: Array,
      default: () => Array.from(Array(4), () => Array(4).fill(0))
    }
  },
  methods: {
    pickColor(pal, col) {
      this.$emit('select', [pal, col]);
    },
    colorText(pal_i, col_i) {
      if (this.selectedPalette == pal_i) {
        return this.palettes[pal_i][col_i];
      }
      return ''
    }
  },
  data: () => {
    return {
      NESCOLORS
    };
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  width: 320px;
  padding-left: 0;
  margin: 0;
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

.selected {
  line-height: 34px; /* minus 6 */
  border: 3px white double;
}
</style>
