<template>
    <div class="home">
        <div v-if="!!data">{{ data.title }}</div>
        <div><button @click="onChangeClick()">change</button></div>
        <img alt="Vue logo" src="@/assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import viewStore from './store';

export default {
    name: 'home',

    components: {
        HelloWorld
    },

    computed: {
        ...mapState(viewStore.name, [
            'initial',
            'data'
        ])
    },

    methods: {
        ...mapMutations(viewStore.name, [
            'setInitial',
            'setData'
        ]),

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
            let data = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.info(`get async data!`);
                    resolve({
                        title: 'async data'
                    });
                }, 3000);
            });

            console.info(data);

            this.setData(data);
            this.setInitial(true);

            return data;
        },

        async onChangeClick () {
            let data = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.info(`change async data!`);
                    resolve({
                        title: 'changed async data'
                    });
                }, 3000);
            });

            this.setData(data);
        }
    },

    // Server-side only
    serverPrefetch () {
        this.registerStore();
        return this.loadData();
    },

    // Client-side only
    mounted () {
        const alreadyPrefetch = this.hasStore();

        this.registerStore();

        if (!alreadyPrefetch) {
            this.loadData();
        }
    },

    destroyed () {
        this.unregisterStore();
    }
};
</script>
