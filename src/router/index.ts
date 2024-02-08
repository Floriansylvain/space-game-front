import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Rules from '@/views/Rules.vue'
import SaveScore from '@/views/SaveScore.vue'
import Score from '@/views/Score.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/game',
			name: 'game',
			component: () => import('@/views/Game.vue')
		},
		{
			path: '/rules',
			name: 'rules',
			component: Rules
		},
		{
			path: '/score/save',
			name: 'saveScore',
			component: SaveScore
		},
		{
			path: '/score',
			name: 'score',
			component: Score
		}
	]
})

export default router
