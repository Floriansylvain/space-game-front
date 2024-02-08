<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
	<main>
		<section>
			<section class="content">
				<article>
					<img src="/gauche_droite.png" alt="Gauche Droite" />
					<p>
						Utilisez les touches directionnelles Gauche et Droite pour déplacer votre
						vaisseau.
					</p>
				</article>
				<article>
					<img src="/tir.png" alt="Espace Haut" />
					<p>
						Appuyez sur la barre d'espace ou la touche directionnelle Haut pour tirer
						des projectiles.
					</p>
				</article>
				<article>
					<img src="/vie.png" alt="Vie" />
					<p>
						Évitez les tirs des envahisseurs. Au bout de 3 vies perdues, c’est Game Over
						!
					</p>
				</article>
				<article>
					<img src="/medaille.png" alt="Medaille" />
					<p>Eliminez un maximum d’envahisseurs pour obtenir le meilleur score !</p>
				</article>
			</section>
			<button type="button" @click="router.push('/game')">JOUER</button>
		</section>
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

main > section {
	width: 800px;
	height: 600px;
	border: 1px solid white;

	padding: 64px;

	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.content {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, 1fr);
	grid-column-gap: 0px;
	grid-row-gap: 0px;
}

.content > article {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 16px;

	width: 100%;
	height: 100%;

	color: white;

	font-family: 'Anek Tamil';
	font-size: 16px;

	padding: 32px;
}
</style>
