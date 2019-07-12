function createModuleStore (name, state) {
    state = Object.assign({
        initial: false
    }, state);

    const mutations = Object.keys(state).reduce((val, key) => {
        val[`set${key.charAt(0).toUpperCase() + key.substr(1)}`] = (state, data) => {
            state[key] = data;
        };
        return val;
    }, {});

    return {
        name,
        namespaced: true,
        state: () => (state),
        mutations: mutations
    };
}

export {
    createModuleStore
};
