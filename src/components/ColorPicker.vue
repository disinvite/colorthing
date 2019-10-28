<template>
  <ul>
    <li
      v-for="(color, index) in NESCOLORS"
      v-bind:key="index"
      v-bind:style="{ backgroundColor: color }"
      v-bind:class="{ selected: (index == value) }"
      v-on:click="pickColor(index)">
      {{ hex ? `x${(index).toString(16).padStart(2,'0')}` : index }}
    </li>
  </ul>
</template>

<script>
import { NESCOLORS } from '../Constants';

export default {
  name: 'ColorPicker',
  props: {
    value: Number,
    hex: Boolean
  },
  methods: {
    pickColor(newColor) {
      this.color = newColor;
      this.$emit('input', newColor);
    }
  },
  data: () => {
    return { NESCOLORS };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style: none;
  width: 640px;
}
li {
  user-select: none;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  display: inline-block;
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
