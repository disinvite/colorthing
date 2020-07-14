<template>
  <div>
    <ContainerRelative
      v-bind:width="384"
      v-bind:height="384">
      <MouseGrid
        v-bind:width="384"
        v-bind:height="384"
        v-bind:dimX="8 * this.editorZoom"
        v-bind:dimY="8 * this.editorZoom"
        v-on:leftClick="mousedown"
        v-on:leftDrag="mouseover"
        v-on:rightClick="eyedropper"
      />
      <GridOverlay
        v-bind:enabled="gridEnabled"
        v-bind:size="editorZoom"
      />
      <PixelDisplay
        v-bind:characters="characters"
        v-bind:palette="palette"
        v-bind:topLeftChr="topLeftChr"
        v-bind:editorZoom="editorZoom"
      />
    </ContainerRelative>
    <input type="checkbox" v-model="floodFill" id="floodCheck"/>
    <label for="floodCheck">Flood fill</label>
    <input type="checkbox" v-model="gridEnabled" id="gridCheck"/>
    <label for="gridCheck">Grid</label>
  </div>
</template>

<script>
import PixelDisplay from './PixelDisplay';
import GridOverlay from './common/GridOverlay';
import ContainerRelative from './common/ContainerRelative';
import MouseGrid from './common/MouseGrid';

const characterWindow2 = [
  [0, 1],
  [16, 17]
];

const characterWindow4 = [
  [0, 1, 2, 3],
  [16, 17, 18, 19],
  [32, 33, 34, 35],
  [48, 49, 50, 51]
];

const findChr = (row, col, zoom) => {
  if (zoom == 2) {
    return characterWindow2[Math.floor(row / 8)][Math.floor(col / 8)];
  } else if (zoom == 4) {
    return characterWindow4[Math.floor(row / 8)][Math.floor(col / 8)];
  }
  return 0;
}

const findPix = (row, col) => {
  return ((row % 8) * 8) + (col % 8);
}

export default {
  name: 'PixelEditor',
  props: {
    characters: {
      type: Array,
      default: () => new Array(256).fill(new Array(64).fill(0))
    },
    topLeftChr: {
      type: Number,
      default: () => 0
    },
    palette: {
      type: Array,
      default: () => [0, 1, 2, 3]
    },
    selectedColor: {
      type: Number,
      default: () => 0
    },
    editorZoom: {
      type: Number,
      default: () => 2
    }
  },
  components: {
    PixelDisplay,
    ContainerRelative,
    MouseGrid,
    GridOverlay
  },
  created() {
    document.addEventListener('mouseup', () => this.clickHeld = false);
  },
  methods: {
    mousedown({row, col}) {
      const whichChr = this.topLeftChr + findChr(row, col, this.editorZoom);
      const whichPix = findPix(row, col);

      this.clickHeld = true;
      if (this.floodFill) {
        this.flood(whichChr, whichPix);
      } else {
        this.pixel(whichChr, whichPix);
      }
    },
    mouseover({row, col}) {
      const whichChr = this.topLeftChr + findChr(row, col, this.editorZoom);
      const whichPix = findPix(row, col);

      if (this.floodFill) {
        return;
      }
      if (this.clickHeld) {
        this.pixel(whichChr, whichPix);
      }
    },
    eyedropper({row, col}) {
      const whichChr = this.topLeftChr + findChr(row, col, this.editorZoom);
      const whichPix = findPix(row, col);
      this.$emit('eyedropper', this.characters[whichChr][whichPix]);
    },
    flood(whichChr, whichPix) {
      const pixels = this.characters[whichChr];
      const curColor = pixels[whichPix];
      if (curColor === this.selectedColor) {
        return;
      }

      const queue = [ whichPix ];
      while (queue.length > 0) {
        // dumb attempt to prevent infinite loop
        // TODO: rewrite if allowing flood fill to cover multiple tiles
        if (queue.length > 64) {
          break;
        }

        const cur = queue.shift();
        if (pixels[cur] !== curColor) {
          continue;
        }

        pixels[cur] = this.selectedColor;

        // left
        if ((cur % 8) != 0) {
          queue.push(cur - 1);
        }

        // right
        if ((cur % 8) != 7) {
          queue.push(cur + 1);
        }

        // up
        if (cur > 7) {
          queue.push(cur - 8);
        }

        // down
        if (cur < 57) {
          queue.push(cur + 8);
        }
      }

      this.$emit('setChr', {whichChr, value: pixels});
    },
    pixel(whichChr, whichPix) {
      const pixels = this.characters[whichChr];
      pixels[whichPix] = this.selectedColor;
      this.$emit('setChr', {whichChr, value: pixels});
    }
  },
  data: () => {
    return {
      gridEnabled: true,
      clickHeld: false,
      floodFill: false
    };
  }
}
</script>

<style scoped>
</style>
