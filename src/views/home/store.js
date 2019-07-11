export default {
    name: 'home',
    namespaced: true,
    state: () => ({
        initial: false,
        data: null
    }),
    mutations: {
        setInitial (state) {
            state.initial = true;
        },

        setData (state, data) {
            state.data = data;
        }
    }
};
