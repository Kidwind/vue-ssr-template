import { mapState, mapMutations } from 'vuex';

function createViewStoreModule (name, state) {
    return {
        name,
        namespaced: true,
        state: () => ({
            ...Object.assign({
                // 页面是否已由服务器端渲染
                initial: false
            }, state)
        }),
        mutations: {
            ...Object.keys(state).reduce((val, key) => {
                val[`set${key.charAt(0).toUpperCase() + key.substr(1)}`] = (state, data) => {
                    state[key] = data;
                };
                return val;
            }, {}),

            setInitial (state, data) {
                state.initial = data;
            }
        }
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

            async loadData () {},

            async clientLoadData () {
                // 这里开始显示处理进度
                let res = await this.loadData();
                // 这里结束显示处理进度
                return res;
            }
        },

        watch: {
            '$route' () {
                this.clientLoadData();
            }
        },

        created () {
            this.registerStore();
        },

        // Server-side only
        async serverPrefetch () {
            let res = await this.loadData();
            // 标识页面已由服务器端渲染
            this.setInitial(true);
            return res;
        },

        // Client-side only
        mounted () {
            if (!this.initial) {
                this.clientLoadData();
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
