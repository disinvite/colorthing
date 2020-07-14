<template>
  <canvas ref="canvas" width="512" height="480"></canvas>
</template>

<script>
export default {
  name: 'Overlay',
  props: {
    enabled: {
      default: 0
    },
    grid: Array
  },
  watch: {
    enabled: function() {
      this.redraw();
    },
    grid: function() {
      this.redraw();
    }
  },
  mounted() {
    this.ctx = this.$refs['canvas'].getContext('2d');
    this.ctx.scale(16, 16); // TODO. should be dynamic
    this.ctx.imageSmoothingEnabled = false;
    this.redraw();
  },
  methods: {
    redraw: function() {
      this.ctx.clearRect(0,0,512,480);
      if (this.enabled) {
        const offscreenCtx = this.offscreen.getContext('2d');
        const imageData = offscreenCtx.getImageData(0, 0, 32, 30);
        const buf = new ArrayBuffer(imageData.data.length);
        const buf8 = new Uint8ClampedArray(buf);
        const buf32 = new Uint32Array(buf);

        for (let i of this.grid) {
          buf32[i] = 0x800000ff;
        }

        imageData.data.set(buf8);
        offscreenCtx.putImageData(imageData, 0, 0);
        this.ctx.drawImage(this.offscreen, 0, 0, 32, 30);
      }
    }
  },
  data() {
    return {
      ctx: null,
      offscreen: new OffscreenCanvas(32, 30)
    }
  }
}
</script>

<style scoped>
canvas {
  z-index: -25;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
