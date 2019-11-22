<template>
  <ul>
    <li
      v-for="(color, index) in colors"
      v-bind:key="index"
      v-bind:style="{ backgroundColor: NESCOLORS[color] }"
      v-bind:class="{ selected: (index === selectedColor) }"
      v-on:click="pickColor(index)">{{ colorText(index) }}</li>
  </ul>
</template>

<script>
import { NESCOLORS } from '../Constants';

export default {
  name: 'Palette',
  props: {
    selectedColor: Number,
    colors: {
      type: Array,
      default: () => [0, 0, 0, 0]
    }
  },
  methods: {
    pickColor(which) {
      this.$emit('select', which);
    },
    colorText(index) {
      if ((index >= this.palSelectStart) && (index < this.palSelectEnd)) {
        return this.colors[index];
      }
      return ''
    }
  },
  computed: {
    palSelectStart: function() {
      return Math.floor(this.selectedColor / 4) * 4;
    },
    palSelectEnd: function() {
      return (Math.floor(this.selectedColor / 4) + 1) * 4;
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
