const state = () => ({
  selectedTile: 0,
  selectedAttribute: 0,
  editAttribute: false,
  showAttribute: false,
  showOcurrences: false,
});

const mutations = {
  selectTile(state, tile) {
      state.selectedTile = tile;
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