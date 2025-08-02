import { createRouter, createWebHistory } from 'vue-router';

import NotFound from './views/NotFound.vue';

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/:pathMatch(.*)*', component: NotFound },
	],
});