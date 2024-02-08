import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import * as PIXI from 'pixi.js'
import { usePlayerStore } from './player'
import { useEnemiesStore } from './enemies'
import { useBulletsStore } from './bullets'

export interface Rank {
	nickname: string
	position: number
	score: number
}

export const useGameStore = defineStore('game', () => {
	const app = new PIXI.Application({
		width: 800,
		height: 600,
		backgroundAlpha: 0
	})

	const rank = ref({
		score: 0
	} as Rank)
	const state = ref(0)
	const started = ref(false)

	const _elapsed = ref(0)

	const _playerStore = usePlayerStore()
	const _enemiesStore = useEnemiesStore()
	const _bulletsStore = useBulletsStore()

	function reset() {
		rank.value.score = 0
		state.value = 0
		_elapsed.value = 0
		_enemiesStore.enemies = []
	}

	function startRenderLoop() {
		_bulletsStore.init(app.stage)
		app.ticker.add((delta) => {
			_elapsed.value += delta
			_playerStore.updatePhysics(delta)
			_enemiesStore.updatePhysics(delta, app.stage)
			_bulletsStore.updateBullets(delta)
		})
		_playerStore.init('/kssr/PNG/playerShip1_blue.png', 3, 5)
		app.stage.addChild(_playerStore?.sprite as unknown as PIXI.DisplayObject)
		window.addEventListener('keydown', _playerStore.updateEvents)
		window.addEventListener('keyup', _playerStore.updateEvents)

		_enemiesStore.spawnAll(app.stage, 10, 'blue')

		setInterval(() => _enemiesStore.spawnAll(app.stage, 5, 'blue'), 5000)

		setTimeout(() => {
			setInterval(() => _enemiesStore.spawnAll(app.stage, 2, 'red'), 2000)
			state.value += 1

			setTimeout(() => {
				setInterval(() => _enemiesStore.spawnAll(app.stage, 3, 'green'), 4000)
				state.value += 1
			}, 20000)
		}, 20000)
	}

	return { app, rank, state, started, reset, startRenderLoop }
})
