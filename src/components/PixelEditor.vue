<template>
  <div>
    <div id="pixel-container">
      <ul class="grid" v-for="c_index in characterWindow" v-bind:key="c_index"
      v-bind:class="{gridEnabled}">
        <li v-for="(cell, p_index) in characters[c_index]"
          v-bind:key="p_index"
          v-bind:style="{ backgroundColor: NESCOLORS[palette[cell]] }"
          v-on:mousedown.left="mousedown(c_index, p_index)"
          v-on:mousedown.right="$emit('eyedropper', cell)"
          v-on:mouseover="mouseover(c_index, p_index)"
          v-on:contextmenu.prevent
          >&nbsp;</li>
      </ul>
    </div>
    <input type="checkbox" v-model="floodFill" id="floodCheck"/>
    <label for="floodCheck">Flood fill</label>
    <input type="checkbox" v-model="gridEnabled" id="gridCheck"/>
    <label for="gridCheck">Grid</label>
  </div>
</template>

<script>
import { NESCOLORS } from '../Constants';

export default {
  name: 'PixelEditor',
  props: {
    characters: {
      type: Array,
      default: () => new Array(256).fill(new Array(64).fill(0))
    },
    topLeftChr: {
      type: Number,
      default: 0
    },
    palette: {
      type: Array,
      default: () => [0, 1, 2, 3]
    },
    selectedColor: {
      type: Number,
      default: () => 0
    }
  },
  computed: {
    characterWindow() {
      return [
        this.topLeftChr,
        this.topLeftChr + 1,
        this.topLeftChr + 16,
        this.topLeftChr + 17
      ];
    }
  },
  created() {
    document.addEventListener('mouseup', () => this.clickHeld = false);
  },
  methods: {
    mousedown(whichChr, whichPix) {
      this.clickHeld = true;
      if (this.floodFill) {
        this.flood(whichChr, whichPix);
      } else {
        this.pixel(whichChr, whichPix);
      }
    },
    mouseover(whichChr, whichPix) {
      if (this.floodFill) {
        return;
      }
      if (this.clickHeld) {
        this.pixel(whichChr, whichPix);
      }
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

        this.$emit('pixelChanged', [whichChr, cur, this.selectedColor]);

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
    },
    pixel(whichChr, whichPix) {
      this.$emit('pixelChanged', [whichChr, whichPix, this.selectedColor]);
    }
  },
  data: () => {
    return {
      gridEnabled: true,
      NESCOLORS,
      clickHeld: false,
      floodFill: false
    };
  }
}
</script>

<style scoped>
div#pixel-container {
  width: 418px;
  height: 418px;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding-left: 0;
  display: inline-block;
  margin: 0;
  width: 208px;
}
ul.gridEnabled {
  border: 0 solid #888;
  border-width: 0 0 1px 1px;
}
ul.gridEnabled li {
  border: 0 dotted #444;
  border-width: 1px 1px 0 0;
}
li {
  user-select: none;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  display: inline-block;
  text-align: center;
  height: 26px;
  width: 26px;
  line-height: 26px;
  color: white;
  vertical-align: middle;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}
li.selected {
  line-height: 20px; /* minus 6 */
  border: 3px white double;
}
</style>
