import { mapState, mapMutations } from 'vuex';

function createViewStoreModule (name, state) {
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

function createViewStoreMixin (viewStore) {
    return {
        computed: {
            ...mapState(viewStore.name, Object.keys(viewStore.state()))
        },

        methods: {
            ...mapMutations(viewStore.name, Object.keys(viewStore.mutations)),

            hasStore () {
                return !!this.$store.state[viewStore.name];
            },

            registerStore () {
                this.$store.registerModule(viewStore.name, viewStore, { preserveState: this.hasStore() });
            },

            unregisterStore () {
                this.$store.unregisterModule(viewStore.name);
            },

            async loadData () {}
        },

        created () {
            this.registerStore();
        },

        // Server-side only
        serverPrefetch () {
            return this.loadData();
        },

        // Client-side only
        mounted () {
            if (!this.initial) {
                this.loadData();
            }
        },

        destroyed () {
            this.unregisterStore();
        }
    };
}

export {
    createViewStoreModule,
    createViewStoreMixin
};
