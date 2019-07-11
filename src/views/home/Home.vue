<template>
    <div class="home">
        <div v-if="!!data">{{ data.title }}</div>
        <img alt="Vue logo" src="@/assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
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
            store.commit(`${viewStore.name}/setInitial`);

            return data;
        }
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
    }
};
</script>
