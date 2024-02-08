import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import * as PIXI from 'pixi.js'
import { usePlayerStore } from './player'
import { useBulletsStore } from './bullets'

export interface Enemy {
	id: number
	sprite: PIXI.Sprite
	health: number
	speed: number
	randomMultiplier: number
	enemyType: 'red' | 'green' | 'blue'
	score: number
	onHit: (id: number, damages: number) => boolean
}

export interface EnemyBullet {
	sprite: PIXI.Sprite
	isGuided: boolean
	speed: number
	dx?: number
	dy?: number
}

const ENEMIES_TYPES = {
	enemies: {
		red: [
			{ texture: '/kssr/PNG/Enemies/enemyRed1.png', speed: 4, health: 1, score: 10 },
			{ texture: '/kssr/PNG/Enemies/enemyRed2.png', speed: 4, health: 1, score: 10 },
			{ texture: '/kssr/PNG/Enemies/enemyRed3.png', speed: 4, health: 1, score: 10 },
			{ texture: '/kssr/PNG/Enemies/enemyRed4.png', speed: 4, health: 1, score: 10 },
			{ texture: '/kssr/PNG/Enemies/enemyRed5.png', speed: 4, health: 1, score: 10 }
		],
		blue: [
			{ texture: '/kssr/PNG/Enemies/enemyBlue1.png', speed: 2, health: 2, score: 5 },
			{ texture: '/kssr/PNG/Enemies/enemyBlue2.png', speed: 2, health: 2, score: 5 },
			{ texture: '/kssr/PNG/Enemies/enemyBlue3.png', speed: 2, health: 2, score: 5 },
			{ texture: '/kssr/PNG/Enemies/enemyBlue4.png', speed: 2, health: 2, score: 5 },
			{ texture: '/kssr/PNG/Enemies/enemyBlue5.png', speed: 2, health: 2, score: 5 }
		],
		green: [
			{ texture: '/kssr/PNG/Enemies/enemyGreen1.png', speed: 1, health: 3, score: 15 },
			{ texture: '/kssr/PNG/Enemies/enemyGreen2.png', speed: 1, health: 3, score: 15 },
			{ texture: '/kssr/PNG/Enemies/enemyGreen3.png', speed: 1, health: 3, score: 15 },
			{ texture: '/kssr/PNG/Enemies/enemyGreen4.png', speed: 1, health: 3, score: 15 },
			{ texture: '/kssr/PNG/Enemies/enemyGreen5.png', speed: 1, health: 3, score: 15 }
		]
	},
	bullets: {
		red: { texture: '/kssr/PNG/Lasers/laserRed05.png', speed: 7 },
		blue: { texture: '/kssr/PNG/Lasers/laserBlue03.png', speed: 5 },
		green: { texture: '/kssr/PNG/Lasers/laserGreen04.png', speed: 3 }
	}
}

export const useEnemiesStore = defineStore('enemies', () => {
	const enemies: Ref<Array<Enemy>> = ref([])

	const _elapsed = ref(0)
	const _lastTimeBulletFired = ref(0)
	const _playerStore = usePlayerStore()
	const _bulletsStore = useBulletsStore()
	const _enemiesIdCounter = ref(0)

	function onHit(
		id: number,
		damages: number,
		stage: PIXI.Container<PIXI.DisplayObject>
	): boolean {
		const enemyIndex = enemies.value.findIndex((e) => e.id === id)
		if (enemyIndex === -1) return false
		const localEnemy = enemies.value[enemyIndex]
		localEnemy.health -= damages
		if (localEnemy.health < 1) {
			stage.removeChild(localEnemy.sprite)
			localEnemy.sprite.destroy()
			enemies.value.splice(enemyIndex, 1)
			return true
		}
		return false
	}

	function spawnOne(
		stage: PIXI.Container<PIXI.DisplayObject>,
		x: number,
		y: number,
		enemyType: 'red' | 'green' | 'blue'
	) {
		const randomBetween0and100 = Math.floor(Math.random() * 100)
		const textureIndex = Math.floor(Math.random() * 4)
		const enemyData = ENEMIES_TYPES.enemies[enemyType][textureIndex]
		const enemy = new PIXI.Sprite(PIXI.Texture.from(enemyData.texture))
		const scale = enemyType === 'green' ? 0.8 : 0.4
		enemy.setTransform(x, y, scale, scale)
		enemy.anchor.set(0.5, 0.5)
		enemies.value.push({
			id: _enemiesIdCounter.value,
			sprite: enemy,
			health: enemyData.health,
			speed: enemyData.speed,
			randomMultiplier: randomBetween0and100,
			score: enemyData.score,
			enemyType,
			onHit: (id, damages) => onHit(id, damages, stage)
		})
		stage.addChild(enemy)
		_enemiesIdCounter.value += 1
	}

	function spawnAll(
		stage: PIXI.Container<PIXI.DisplayObject>,
		quantity: number,
		enemyType: 'red' | 'green' | 'blue'
	) {
		for (let j = 0; j < quantity; j++) {
			const x = Math.floor(Math.random() * (600 - 200) + 200)
			const y = Math.floor(Math.random() * -quantity * 150)
			spawnOne(stage, x, y, enemyType)
		}
	}

	function _fireRandomBullet(stage: PIXI.Container<PIXI.DisplayObject>): void {
		let i = 0
		let randomIndex = 0
		let randomEnemy = {} as Enemy
		while (i < 100) {
			randomIndex = Math.floor(Math.random() * enemies.value.length)
			randomEnemy = enemies.value[randomIndex]
			i++

			if (!randomEnemy) continue
			if (randomEnemy.sprite && !randomEnemy.sprite.destroyed) {
				if (randomEnemy.sprite.y > 500 || randomEnemy.sprite.y < 0) continue
				break
			}
		}
		if (!randomEnemy || !randomEnemy.sprite || randomEnemy.sprite?.destroyed) return
		if (!_playerStore.sprite) return
		const enemyData = ENEMIES_TYPES.bullets[randomEnemy.enemyType]
		const bullet = new PIXI.Sprite(PIXI.Texture.from(enemyData.texture))
		bullet.anchor.set(0.5, 0.5)
		bullet.x = randomEnemy.sprite.x
		bullet.y = randomEnemy.sprite.y

		// const dx = _playerStore.sprite.x - bullet.x
		// const dy = _playerStore.sprite.y - bullet.y
		// bullet.angle = randomEnemy.isFollowingPlayer
		// 	? (Math.atan2(dy, dx) * 180) / Math.PI - 90
		// 	: 180
		bullet.angle = 180

		_bulletsStore.addBullet({
			sprite: bullet,
			speed: enemyData.speed,
			sender: randomEnemy.sprite,
			collisionHandler(bullet) {
				const player = _playerStore.sprite as PIXI.Sprite
				if (!player || player.destroyed) return false
				const playerHalfWidth = player.width / 2
				const playerHalfHeight = player.height / 2
				const isHit =
					bullet.y >= player.y - playerHalfHeight &&
					bullet.y <= player.y + playerHalfHeight &&
					bullet.x >= player.x - playerHalfWidth &&
					bullet.x <= player.x + playerHalfWidth
				if (!isHit) return false
				_playerStore.onHit(stage)
				return true
			}
		})
	}

	function _updateMovements(delta: number, stage: PIXI.Container<PIXI.DisplayObject>) {
		const localEnemies = Array.from(enemies.value)
		for (const enemy of localEnemies) {
			if (enemy.sprite.destroyed || !_playerStore.sprite) continue
			enemy.sprite.x += Math.cos(_elapsed.value / (enemy.randomMultiplier + 100))
			enemy.sprite.y += enemy.speed * delta

			if (enemy.sprite.y > 600) {
				stage.removeChild(enemy.sprite)
				enemy.sprite.destroy()
				const i = enemies.value.findIndex((e) => e.id === enemy.id)
				enemies.value.splice(i, 1)
				return
			}
			// if (enemy.isFollowingPlayer) {
			// 	const dx = _playerStore.sprite.x - enemy.sprite.x
			// 	const dy = _playerStore.sprite.y - enemy.sprite.y
			// 	enemy.sprite.angle = (Math.atan2(dy, dx) * 180) / Math.PI - 90
			// }
		}
	}

	function updatePhysics(delta: number, stage: PIXI.Container<PIXI.DisplayObject>) {
		_elapsed.value += delta
		_updateMovements(delta, stage)
		if (_elapsed.value > _lastTimeBulletFired.value + 15) {
			_fireRandomBullet(stage)
			_lastTimeBulletFired.value = _elapsed.value
		}
	}

	return { enemies, updatePhysics, spawnAll }
})
