export default {
  namespaced: true,

  state: () => ({
    count: 0
  }),

  mutations: {
    updateCount(state, newValue) {
      state.count = newValue;
    },
  }
}
