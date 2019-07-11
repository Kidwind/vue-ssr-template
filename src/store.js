import Vue from 'vue';
import Vuex from 'vuex';
import HomeStore from './views/home/store';

Vue.use(Vuex);

export function createStore () {
    return new Vuex.Store({
        state: {},
        mutations: {},
        actions: {},

        modules: [
            HomeStore
        ].reduce((prev, cur) => {
            prev[cur.name] = cur;
            return prev;
        }, {})
    });
}
