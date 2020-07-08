<template>
  <div
    v-bind:style="styleObj"
    v-on:mousedown.left="mouseLeft"
    v-on:mousedown.right="mouseRight"
    v-on:mousemove="mouseMove"
    v-on:contextmenu.prevent
  >&nbsp;</div>
</template>

<script>
export default {
  name: 'MouseGrid',
  props: {
    width: Number,
    height: Number,
    dimX: Number,
    dimY: Number
  },
  computed: {
    styleObj: function() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }
  },
  data() {
    return {
      clickHeld: false
    }
  },
  created() {
    document.addEventListener('mouseup', () => this.clickHeld = false);
  },
  methods: {
    which(evt) {
      return {
        row: Math.floor(this.dimY * evt.offsetY / this.height),
        col: Math.floor(this.dimX * evt.offsetX / this.width)
      };
    },
    mouseLeft(evt) {
      this.clickHeld = true;
      this.$emit('leftClick', this.which(evt));
    },
    mouseRight(evt) {
      this.$emit('rightClick', this.which(evt));
    },
    mouseMove(evt) {
      if (this.clickHeld) {
        this.$emit('leftDrag', this.which(evt));
      }
    }
  }
}
</script>

<style scoped>
div {
  position: absolute;
}
</style>
