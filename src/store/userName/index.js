export default {
  namespaced: true,

  state: () => ({
    userName: ''
  }),

  mutations: {
    updateName(state, newValue) {
      state.userName = newValue;
    },
  }
}
