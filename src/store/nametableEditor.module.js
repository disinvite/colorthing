const state = () => ({
  selectedTile: 0,
  selectedAttribute: 0,
  editAttribute: false,
  showAttribute: false,
  showOcurrences: false,
  selectWidth: 1,
  selectHeight: 1
});

const divmod = (n,d) => [Math.floor(n/d), n%d];

const mutations = {
  selectTile(state, tile) {
    let [row, col] = divmod(tile, 16);
    if ((row + state.selectHeight) > 16) {
      row = 16 - state.selectHeight;
    }
    if ((col + state.selectWidth) > 16) {
      col = 16 - state.selectWidth;
    }
    state.selectedTile = (row*16) + col;
  },
  selectAttribute(state, attr) {
      state.selectedAttribute = attr;
  },
  toggleEditAttribute(state) {
      state.editAttribute = !state.editAttribute;
  },
  toggleShowAttribute(state) {
      state.showAttribute = !state.showAttribute;
  },
  toggleShowOcurrences(state) {
      state.showOcurrences = !state.showOcurrences;
  },
  changeSelectSize(state, {width, height}) {
    state.selectWidth = width;
    state.selectHeight = height;
  }
};

const getters = {
  currentPalette(state, getters, rootState) {
    return rootState.data.backgroundColors[state.selectedAttribute];
  },
  currentTileUsage(state, getters, rootState) {
    return rootState.data.nametable.reduce((a, e, i) => {
      if (e === state.selectedTile) {
        a.push(i);
      }
      return a;
    }, []);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
};