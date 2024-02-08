<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
	<main>
		<header><img src="/logo_space.png" alt="Space Battle" /></header>
		<h3>Une invasion extraterrestre menace ! <br />Êtes-vous prêt à défendre la Terre ?</h3>
		<button type="button" @click="router.push('/rules')">COMMENCER</button>
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
}

main > h3 {
	font-family: 'Anek Tamil';
	font-weight: 400;
	color: white;
}

header > img {
	max-width: 300px;
	width: 100%;
}
</style>
