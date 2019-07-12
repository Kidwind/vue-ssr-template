<template>
    <div class="home">
        <div v-if="!!data">{{ data.title }}</div>
        <div><button @click="onChangeClick()">change</button></div>
        <img alt="Vue logo" src="@/assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
import { createViewStoreModule, createViewStoreMixin } from '@/app/utils/store';
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

const viewStore = createViewStoreModule('home', {
    data: null
});

const viewStoreMixin = createViewStoreMixin(viewStore);

export default {
    name: 'home',

    components: {
        HelloWorld
    },

    mixins: [viewStoreMixin],

    methods: {
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
    }
};
</script>
