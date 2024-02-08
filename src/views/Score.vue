<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import { onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

interface Rank {
	id: number
	nickname: string
	score: number
	position?: number
}

const playerStore = usePlayerStore()
const gameStore = useGameStore()
const router = useRouter()
const ranks: Ref<Array<Rank>> = ref([])

onMounted(() => {
	fetch(`${import.meta.env.VITE_SPACE_GAME_API}/score`)
		.then((response) => response.json())
		.then((data) => (ranks.value = data))
})
</script>

<template>
	<main>
		<section>
			<header>
				<img src="/ranking.png" alt="Ranking" />
			</header>
			<ol class="ranks">
				<li class="rank" v-for="(rank, i) in ranks" :key="rank.id">
					<span>{{ i + 1 }}.</span> <span>{{ rank.nickname }}</span>
					<span>{{ rank.score }}</span>
				</li>
			</ol>
			<div class="rank player-rank">
				<span>{{ gameStore?.rank.position + 1 }}.</span>
				<span>{{ gameStore?.rank.nickname }}</span>
				<span>{{ gameStore?.rank.score }}</span>
			</div>
		</section>
		<button type="button" @click="() => router.push('/')">RETOUR</button>
	</main>
</template>

<style scoped>
main {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 32px;

	width: 100%;
	height: 100vh;

	background-image: url('/kssr/Backgrounds/custom-1.png');

	font-family: 'Balgin Black';

	color: white;
}

main > section {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 32px;

	max-width: 400px;
	width: 100%;
}

img {
	width: 100%;
}

.ranks {
	padding: 0;
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 8px;
	width: 100%;
}

.rank {
	display: flex;
	align-items: center;
	gap: 32px;

	list-style-position: inside;

	background-origin: border-box;
	background-color: #ffffff22;
	color: white;
	border-radius: 4px;

	font-family: 'Balgin Black';
	font-size: 20px;

	padding: 16px 40px;
	width: 100%;
}

.rank span:first-child {
	width: 16px;
}

.rank span:last-child {
	margin-left: auto;
}

.player-rank {
	border: 2px solid #e5449c;
}
</style>
