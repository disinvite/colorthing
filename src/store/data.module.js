// do these belong here?
import { Serialize } from '../services/SceneObject'
import { Deserialize } from '../services/SceneObject'
import { bin_serializeChr, bin_serializeNametable } from '../services/BinaryFile'
import { bin_deserializeChr, bin_deserializeNametable } from '../services/BinaryFile'

// 1 and 2-dimensional zeroed array helpers
const _zeroArray1d = x => Array(x).fill(0);
const _zeroArray2d = (x,y) => Array.from(Array(x), () => Array(y).fill(0));

/*
// yyChr
const defaultPalette = () => { 
  return [
    [0x0f,0x17,0x28,0x39],
    [0x0f,0x30,0x26,0x05],
    [0x0f,0x20,0x10,0x00],
    [0x0f,0x13,0x23,0x33]
  ];
};
*/

const defaultPalette = () => {
  return [
    [13, 3, 19, 35],
    [13, 10, 26, 42],
    [13, 4, 20, 36],
    [13, 0, 16, 32]
  ];
};

const state = () => ({
  nametable:        _zeroArray1d(960),
  attributes:       _zeroArray1d(256),
  backgroundChr:    _zeroArray2d(256, 64),
  spriteChr:        _zeroArray2d(256, 64),
  backgroundColors: defaultPalette(),
  spriteColors:     _zeroArray2d(4, 4)
});

const mutations = {
  // TODO: maybe entire chr array should be replaced?
  // to allow for editing more than one chr
  setChr(state, {whichChr, value}) {
    state.backgroundChr.splice(whichChr, 1, value);
  },
  setNametable(state, {which, value}) {
    state.nametable.splice(which, 1, value);
  },
  setAttribute(state, {which, value}) {
    state.attributes.splice(which, 1, value);
  },
  setBackgroundColors(state, colors) {
    state.backgroundColors.splice(0, 4, colors);
  },

  deserializeFromJSON(state, jsonString) {
    const data = Deserialize(state, jsonString);
    Object.assign(state, data); // ok?
  },
  deserializeNametableFromBinary(state, buf) {
    const {tileArray, attrArray} = bin_deserializeNametable(buf);
    state.nametable.splice(0, 960, ...tileArray);
    state.attributes.splice(0, 256, ...attrArray);
  },
  deserializeChrFromBinary(state, buf) {
    const chrArray = bin_deserializeChr(buf);
    state.backgroundChr.splice(0, 256, ...chrArray);
  }
};

const getters = {
  serializeToJSON(state) {
    return Serialize({
      nametable: state.nametable,
      attributes: state.attributes,
      backgroundChr: state.backgroundChr, 
      spriteChr: state.spriteChr,
      backgroundColors: state.backgroundColors,
      spriteColors: state.spriteColors
    });
  },
  serializeNametableToBinary(state) {
    return bin_serializeNametable(state.nametable, state.attributes);
  },
  serializeChrToBinary(state) {
    return bin_serializeChr(state.backgroundChr);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
