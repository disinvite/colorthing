const state = () => ({
  enabled: false,
  imageData: null,
  imageWidth: 0,
  imageHeight: 0,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  alpha: 50,
  pixelMode: false
});

const mutations = {
  toggleEnabled(state) {
    state.enabled = !state.enabled;
  },
  setDataUrl(state, dataUrl) {
    state.imageData = dataUrl;
  },
  setImageDimensions(state, { width, height }) {
    state.imageWidth = width;
    state.imageHeight = height;
  },
  setScale(state, scale) {
    state.scale = scale;
  },
  setOffsetX(state, x) {
    state.offsetX = x;
  },
  setOffsetY(state, y) {
    state.offsetY = y;
  },
  setAlpha(state, value) {
    state.alpha = Math.max(0, Math.min(Math.floor(value), 100));
  },
  togglePixelMode(state) {
    state.pixelMode = !state.pixelMode;
  }
};

function getImageDimensions(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

const actions = {
  async setImageByDataUrl({ commit }, dataUrl) {
    commit('setImageDimensions', await getImageDimensions(dataUrl));
    commit('setDataUrl', dataUrl);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
