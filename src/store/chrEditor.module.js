const state = () => ({
  zoom: 2,
  selectedTile: 0,
  selectedPalette: 0,
  selectedColor: 0
});

const divmod = (x,n) => [Math.floor(x/n), x%n];

const recalculateTileSelection = (tile, zoom) => {
  if (zoom == 1) {
    return tile;
  } else if (zoom == 2) {
    const [row, col] = divmod(tile, 16);
    return (Math.min(row, 14) * 16) + Math.min(col, 14);
  } else if (zoom == 4) {
    const [row, col] = divmod(tile, 16);
    return (Math.min(row, 12) * 16) + Math.min(col, 12);
  }
}

const mutations = {
  selectTile(state, tile) {
    state.selectedTile = recalculateTileSelection(tile, state.zoom);
  },
  selectColor(state, [pal, color]) {
    state.selectedPalette = pal;
    state.selectedColor = color;
  },
  selectColorOnly(state, color) {
    state.selectedColor = color;
  },
  setZoom(state, zoom) {
    state.zoom = zoom;
    state.selectedTile = recalculateTileSelection(state.selectedTile, state.zoom);
  }
};

const getters = {
  currentPalette(state, getters, rootState) {
    return rootState.data.backgroundColors[state.selectedPalette];
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
};