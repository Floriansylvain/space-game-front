<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const nickname = ref('')

function onValidation() {
	fetch(`${import.meta.env.VITE_SPACE_GAME_API}/score`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			nickname: nickname.value,
			score: gameStore.rank.score
		})
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.issues) throw new Error(data.issues)
			gameStore.rank.position = data.position as number
			gameStore.rank.nickname = data.nickname as string
			gameStore.rank.score = data.score as number
			router.push('/score')
		})
		.catch((e) => {
			console.error(e)
			alert('Une erreur est survenue :(')
		})
}
</script>

<template>
	<main>
		<header>
			<div>
				<h2>Score</h2>
				<h1>{{ gameStore.rank.score }}</h1>
			</div>
			<input type="text" placeholder="Tape ton nom" maxlength="16" v-model="nickname" />
		</header>
		<button type="button" @click="onValidation">VALIDER</button>
	</main>
</template>

<style scoped>
main {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 128px;

	width: 100%;
	height: 100vh;

	background-image: url('/kssr/Backgrounds/custom-1.png');

	font-family: 'Balgin Black';

	color: white;
}

main > header {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 300px;
	gap: 64px;
}

h1,
h2 {
	margin: 0;
	text-align: center;
}
</style>
