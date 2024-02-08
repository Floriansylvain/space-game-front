import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import * as PIXI from 'pixi.js'
import { useEnemiesStore, type Enemy, type EnemyBullet } from './enemies'
import { useGameStore } from './game'
import { useBulletsStore, type BulletEntity } from './bullets'
import { useRouter } from 'vue-router'
import router from '@/router'

export const usePlayerStore = defineStore('player', () => {
	const sprite: Ref<PIXI.Sprite | undefined> = ref()
	const movement: Ref<'left' | 'idle' | 'right'> = ref('idle')
	const damagesDiv: Ref<HTMLDivElement | undefined> = ref()
	const gameOver: Ref<HTMLDivElement | undefined> = ref()

	const _enemiesStore = useEnemiesStore()
	const _gameStore = useGameStore()
	const _router = useRouter()

	const _health: Ref<number> = ref(3)
	const _speed: Ref<number> = ref(5)
	const _keybinding = ref([
		{ key: 'ArrowLeft', isPressed: false },
		{ key: 'ArrowRight', isPressed: false },
		{ key: ' ', isPressed: false },
		{ key: 'ArrowUp', isPressed: false }
	])
	const _isKeyPressed = (key: string): boolean | undefined =>
		_keybinding.value.find((k) => k.key === key)?.isPressed

	const _bulletsStore = useBulletsStore()
	const _bulletTexture = PIXI.Texture.from('/kssr/PNG/Lasers/laserBlue01.png')

	const _elapsed = ref(0)

	function init(spriteFile: string, health: number, speed: number): void {
		sprite.value = PIXI.Sprite.from(spriteFile)
		sprite.value.x = 400 + sprite.value.width / 2
		sprite.value.y = 525
		sprite.value.scale.set(0.5, 0.5)
		sprite.value.anchor.set(0.5, 0.5)
		_health.value = health
		_speed.value = speed
	}

	function _fireBullet(): void {
		if (!sprite.value || sprite.value.destroyed) return
		const bullet = new PIXI.Sprite(_bulletTexture)
		bullet.x = sprite.value.x - bullet.width / 2 + Math.floor(Math.random() * 12 - 6)
		bullet.y = sprite.value.y - bullet.height / 2
		_bulletsStore.addBullet({
			sprite: bullet,
			speed: -5,
			sender: sprite?.value,
			collisionHandler: (bullet) => {
				if (!sprite.value) return false
				for (const enemy of _enemiesStore.enemies) {
					const enemyHalfWidth = enemy.sprite.width / 2
					const enemyHalfHeight = enemy.sprite.height / 2
					const isHit =
						bullet.y >= enemy.sprite.y - enemyHalfHeight &&
						bullet.y <= enemy.sprite.y + enemyHalfHeight &&
						bullet.x >= enemy.sprite.x - enemyHalfWidth &&
						bullet.x <= enemy.sprite.x + enemyHalfWidth
					if (isHit) {
						const isDead = enemy.onHit(enemy.id, 1)
						if (isDead) _gameStore.rank.score += enemy.score
						return true
					}
				}
				return false
			}
		})
	}

	function _checkMovement(delta: number): void {
		if (!sprite.value || sprite.value.destroyed) return
		if (_isKeyPressed('ArrowLeft') && sprite.value.x > 0 + sprite.value.width / 2) {
			sprite.value.x -= _speed.value * delta
			sprite.value.skew.set(0, -0.2)
		} else if (_isKeyPressed('ArrowRight') && sprite.value.x < 800 - sprite.value.width / 2) {
			sprite.value.skew.set(0, 0.2)
			sprite.value.x += _speed.value * delta
		} else {
			sprite.value.skew.set(0, 0)
		}
	}

	function _checkFire(fireRate: number = 15): void {
		if ((_isKeyPressed(' ') || _isKeyPressed('ArrowUp')) && _elapsed.value > fireRate) {
			_fireBullet()
			_elapsed.value = 0
		}
	}

	function onHit(stage: PIXI.Container<PIXI.DisplayObject>): boolean {
		_health.value -= 1
		if (damagesDiv?.value) damagesDiv.value.style.backgroundColor = 'white'
		const isDead = _health.value < 1
		if (isDead && sprite.value) {
			stage.removeChild(sprite.value)
			sprite.value?.destroy()
			if (!gameOver.value) return false
			gameOver.value.style.visibility = 'visible'
			setTimeout(() => {
				router.push('/score/save')
			}, 2000)
		}
		return isDead
	}

	function updateEvents(e: KeyboardEvent): void {
		if (!movement?.value) return
		const key = _keybinding.value.find((k) => k.key === e.key)
		if (!key) return
		key.isPressed = e.type === 'keydown'
	}

	function updatePhysics(delta: number): void {
		_elapsed.value += delta
		_checkMovement(delta)
		_checkFire()
	}

	return {
		init,
		sprite,
		movement,
		_health,
		damagesDiv,
		gameOver,
		onHit,
		updateEvents,
		updatePhysics
	}
})
