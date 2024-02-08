import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import * as PIXI from 'pixi.js'

export interface DomainBullet {
	sprite: PIXI.Sprite
	speed: number
	sender: PIXI.Sprite
	collisionHandler: (bullet: PIXI.Sprite) => boolean
}

export interface BulletEntity extends DomainBullet {
	id: number
}

export const useBulletsStore = defineStore('bullets', () => {
	const _bullets: Ref<Array<BulletEntity>> = ref([])
	const _stage: Ref<PIXI.Container<PIXI.DisplayObject> | undefined> = ref()
	const _bulletIdCounter = ref(0)

	function init(stage: PIXI.Container<PIXI.DisplayObject>) {
		_stage.value = stage
	}

	function addBullet(bullet: DomainBullet) {
		_bullets.value.push({
			...bullet,
			id: _bulletIdCounter.value
		})
		_bulletIdCounter.value += 1
		_stage.value?.addChild(bullet.sprite)
	}

	function _destroyBullet(bulletId: number) {
		const bulletIndex = _bullets.value.findIndex((b) => b.id === bulletId)
		if (bulletIndex === -1) return

		const bullet = _bullets.value[bulletIndex]

		_stage.value?.removeChild(bullet.sprite)
		_bullets.value.splice(bulletIndex, 1)
		bullet.sprite.destroy()
	}

	function updateBullets(delta: number) {
		const bulletsCopy = Array.from(_bullets.value)

		for (const bullet of bulletsCopy) {
			if (!bullet.sprite || bullet.sprite.destroyed) continue
			bullet.sprite.y += bullet.speed * delta
			const isBulletOutOfBound = bullet.sprite.y >= 600 || bullet.sprite.y <= 0
			const isCollided = bullet.collisionHandler(bullet.sprite)
			if (isBulletOutOfBound || isCollided) {
				_destroyBullet(bullet.id)
			}
		}
	}

	return { init, addBullet, updateBullets }
})
