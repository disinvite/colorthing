<template>
  <ul>
    <li
      v-for="(color, index) in value"
      v-bind:key="index"
      v-bind:style="{ backgroundColor: NESCOLORS[color] }"
      v-bind:class="{ selected: (index === selectedColor) }"
      v-on:click="pickColor(index)">&nbsp;</li>
  </ul>
</template>

<script>
import { NESCOLORS } from '../Constants';

export default {
  name: 'Palette',
  props: {
    value: {
      type: Array,
      default: () => [0, 0, 0, 0]
    }
  },
  methods: {
    pickColor(which) {
      this.selectedColor = which;
      this.$emit('select', which);
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
  width: 160px;
  padding-left: 0;
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
}

.selected {
  line-height: 34px; /* minus 6 */
  border: 3px white double;
}
</style>
