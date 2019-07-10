<template>
    <div class="home">
        <div v-if="!!data">{{ data.title }}</div>
        <img alt="Vue logo" src="../assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

const viewStore = {
    name: 'home',
    namespaced: true,
    state: () => ({
        data: null
    }),
    mutations: {
        setData (state, data) {
            state.data = data;
        }
    }
};

export default {
    name: 'home',

    components: {
        HelloWorld
    },

    computed: {
        ...mapState(viewStore.name, [
            'data'
        ])
    },

    methods: {
        hasStore () {
            return !!this.$store.state[viewStore.name];
        },

        registerStore () {
            this.$store.registerModule(viewStore.name, viewStore, { preserveState: this.hasStore() });
        },

        unregisterStore () {
            this.$store.unregisterModule(viewStore.name);
        },

        async loadData () {
            const store = this.$store;

            let data = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        title: 'async data'
                    });
                }, 3000);
            });

            console.info(data);

            store.commit(`${viewStore.name}/setData`, data);

            return data;
        }
    },

    // Server-side only
    serverPrefetch () {
        this.registerStore();
        return this.loadData();
    },

    // Client-side only
    mounted () {
        // We already incremented 'count' on the server
        // We know by checking if the 'foo' state already exists
        const alreadyPrefetch = this.hasStore();

        // We register the foo module
        this.registerStore();

        if (!alreadyPrefetch) {
            this.loadData();
        }
    },

    // IMPORTANT: avoid duplicate module registration on the client
    // when the route is visited multiple times.
    destroyed () {
        this.unregisterStore();
    }
};
</script>
