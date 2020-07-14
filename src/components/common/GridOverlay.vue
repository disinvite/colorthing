<template>
  <canvas ref="canvas" width="384" height="384"></canvas>
</template>

<script>
export default {
  name: 'GridOverlay',
  props: {
    enabled: Boolean,
    size: Number
  },
  watch: {
    enabled: function() {
      this.redraw();
    },
    size: function() {
      this.redraw();
    }
  },
  mounted() {
    this.ctx = this.$refs['canvas'].getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.redraw();
  },
  methods: {
    redraw: function() {
      this.ctx.clearRect(0,0,384,384);
      if (!this.enabled) {
        return;
      }

      this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      //this.ctx.setLineDash([5, 2]);

      const step = Math.floor(48 / this.size);
      for (let i = 1; i < (8 * this.size); i++) {
        // thicker line on the sprite boundary
        if (i % 8 == 0) {
          this.ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        } else {
          this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        }

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0.5 + step * i);
        this.ctx.lineTo(384, 0.5 + step * i);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(0.5 + step * i, 0);
        this.ctx.lineTo(0.5 + step * i, 384);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  },
  data() {
    return {
      ctx: null,
    } 
  }
}
</script>

<style scoped>
canvas {
  z-index: -50;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
