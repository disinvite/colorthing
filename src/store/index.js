import Vue from 'vue';
import Vuex from 'vuex';
import data from './data.module';
import chrEditor from './chrEditor.module';
import nametableEditor from './nametableEditor.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
      data,
      chrEditor,
      nametableEditor
  }
});
