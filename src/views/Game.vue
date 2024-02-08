<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import router from '@/router'

const canva: Ref<HTMLDivElement | undefined> = ref()
const gameStore = useGameStore()
const playerStore = usePlayerStore()
const gameOver: Ref<HTMLDivElement | undefined> = ref()

onMounted(() => {
	if (!canva.value) return
	canva.value.innerHTML = ''
	canva.value.appendChild(gameStore.app.view as unknown as Node)

	if (gameStore.started) {
		router.go(0)
	} else {
		gameStore.startRenderLoop()
		gameStore.started = true
	}

	if (!gameOver || !playerStore) return
	playerStore.gameOver = gameOver.value
})
</script>

<template>
	<main>
		<div class="background-1" style="filter: blur(3px)"></div>
		<section>
			<div class="background-1"></div>
			<div class="background-2"></div>
			<div class="score">
				<h3 class="health">
					<img src="/kssr/PNG/UI/playerLife1_blue.png" />
					X {{ playerStore._health }}
				</h3>
				<h3>Score: {{ gameStore.rank.score }}</h3>
			</div>
			<div class="level">
				<h3>Niveau {{ gameStore.state + 1 }}</h3>
			</div>
			<div ref="canva" class="canva"></div>
			<div ref="gameOver" class="game-over">
				<img src="/game_over.png" />
			</div>
		</section>
	</main>
</template>

<style scoped>
main {
	position: relative;
	width: 100%;
	height: 100vh;

	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	background-color: #6f3a8c;

	font-family: 'Balgin Black', consolas;
	color: white;

	overflow: hidden;
}

section {
	position: relative;
	z-index: 2;
	border: solid 1px rgb(255, 255, 255);
	overflow: hidden;
	box-shadow: 0 0 200px #ffffff33;
}

.background-1,
.background-2 {
	position: absolute;
	z-index: 0;
	background: url('/kssr/Backgrounds/custom-1.png') repeat-y center;
	animation: slide 10s linear infinite;
	width: 100%;
	height: 600%;
	top: -200%;
	opacity: 70%;
}

.background-2 {
	z-index: 1;
	background: url('/kssr/Backgrounds/custom-2.png') repeat center;
	width: 600%;
	left: -200%;
	animation: slide 5s linear infinite;
	opacity: 100%;
}

.score {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 4;
	padding: 32px;

	display: flex;
	justify-content: space-between;
	align-items: left;

	width: 100%;

	font-family: 'Balgin Black';
}

.score > * {
	margin: 0;
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
}

.level {
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 4;
	padding: 16px;

	display: flex;
	justify-content: space-between;
	align-items: left;

	width: 100%;

	font-family: 'Balgin Black';
}

.health {
	display: flex;
	align-items: center;
	gap: 8px;
}

.game-over {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;

	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 5;

	visibility: hidden;
}

.canva {
	position: relative;
	z-index: 3;
}

@keyframes slide {
	0% {
		transform: translate3d(0, 0, 0);
	}
	100% {
		transform: translate3d(0, 1024px, 0);
	}
}
</style>
