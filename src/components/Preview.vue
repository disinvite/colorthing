<template>
  <canvas ref="canvas" width="32" height="32"></canvas>
</template>

<script>
import { NESCOLORS } from '../Constants';

export default {
  name: 'Preview',
  props: {
    image: {
      type: Array,
      default: () => new Array(64).fill(0)
    },
    palette: {
      type: Array,
      default: () => [0, 0, 0, 0]
    }
  },
  watch: {
    image: function() {
      this.redraw();
    },
    palette: function() { 
      this.redraw();
    }
  },
  methods: {
    redraw: function() {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const pix = (row * 8) + col;
          const palColor = this.palette[this.image[pix]];
          this.ctx.fillStyle = NESCOLORS[palColor];
          this.ctx.fillRect(col, row, 1, 1);
        }
      }
    }
  },
  mounted: function() {
    this.ctx = this.$refs['canvas'].getContext('2d');
    this.ctx.scale(4, 4);
    this.redraw();
  },
  data: () => {
    return {
      NESCOLORS,
      ctx: null
    };
  }
}
</script>

<style scoped>
</style>
