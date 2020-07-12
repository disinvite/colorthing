<template>
  <div>
    <div id="pixel-container"
      v-bind:class="{ gridEnabled, editorZoom2: editorZoom == 2, editorZoom4: editorZoom == 4 }">
      <ul v-for="c_index in characterWindow" v-bind:key="c_index">
        <li v-for="(cell, p_index) in characters[c_index]"
          v-bind:key="p_index"
          v-bind:style="{ backgroundColor: NESCOLORS[palette[cell]] }"
          v-bind:class="{ rightEdge: (p_index % 8) == 7, bottomEdge: (p_index >= 56) }"
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
  computed: {
    characterWindow: function() {
      if (this.editorZoom == 2) {
        return [
          this.topLeftChr,
          this.topLeftChr + 1,
          this.topLeftChr + 16,
          this.topLeftChr + 17
        ];
      } else if (this.editorZoom == 4) {
        return [
          this.topLeftChr,
          this.topLeftChr + 1,
          this.topLeftChr + 2,
          this.topLeftChr + 3,
          this.topLeftChr + 16,
          this.topLeftChr + 17,
          this.topLeftChr + 18,
          this.topLeftChr + 19,
          this.topLeftChr + 32,
          this.topLeftChr + 33,
          this.topLeftChr + 34,
          this.topLeftChr + 35,
          this.topLeftChr + 48,
          this.topLeftChr + 49,
          this.topLeftChr + 50,
          this.topLeftChr + 51,
        ];
      } else {
        return [this.topLeftChr];
      }
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
      NESCOLORS,
      clickHeld: false,
      floodFill: false
    };
  }
}
</script>

<style scoped>
div#pixel-container {
  width: 384px;
  height: 384px;
  margin-bottom: 20px;
  margin-right: 20px;
}
ul {
  list-style: none;
  padding: 0;
  display: inline-block;
  margin: 0;
  width: 384px;
  height: 384px;
  line-height: 0px;
}
div#pixel-container.editorZoom2 > ul {
  width: 192px;
  height: 192px;
}
div#pixel-container.editorZoom4 > ul {
  width: 96px;
  height: 96px;
}
div#pixel-container.editorZoom2 > ul > li {
  width: 24px;
  height: 24px;
}
div#pixel-container.editorZoom4 > ul > li {
  width: 12px;
  height: 12px;
}
div#pixel-container.gridEnabled ul li {
  border-right: 1px dotted #444;
  border-bottom: 1px dotted #444;
}
div#pixel-container.gridEnabled ul li.rightEdge {
  border-right: 1px solid #888;
}
div#pixel-container.gridEnabled ul li.bottomEdge {
  border-bottom: 1px solid #888;
}
li {
  box-sizing: border-box;
  user-select: none;
  padding: 0;
  margin: 0;
  display: inline-block;
  height: 48px;
  width: 48px;
  vertical-align: top; /* to prevent 1px gap between ul's vertically */
}
</style>
