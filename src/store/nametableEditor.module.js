const state = () => ({
  selectedTile: 0,
  selectedAttribute: 0,
  editAttribute: false,
  showAttribute: false
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
  }
};

const getters = {
  currentPalette(state, getters, rootState) {
    return rootState.data.backgroundColors[state.selectedAttribute];
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
};