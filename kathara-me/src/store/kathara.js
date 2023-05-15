import Vue from "vue";

export const kathara = {
  namespaced: true,
  state: {
    lab: { lab_name: null, lab_hash: null, lab_status: null, success: null, info: null },
  },
  getters: {
    get_lab(state) {
       Vue.$log.info("Getting ", state.lab)
      return state.lab;
    },
  },
  mutations: {
    set_lab(state, importData) {

      Vue.$log.info("imported", importData);
      state.lab = importData;
    },
  },
};
