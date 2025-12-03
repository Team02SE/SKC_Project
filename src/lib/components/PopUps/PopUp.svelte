<script lang="ts">
	import ButtonText from '../Buttons/ButtonText.svelte';

	let { heading, question, onYes, onClose } = $props();
</script>

<section class=" z-99 h-full items-center">
	<div class="flex flex-col items-center bg-white align-middle">
		<h1 class="text-center text-2xl">{heading}</h1>
		<div class="mt-10 flex flex-col items-center">
			<p class="text-center text-xl">{question}</p>
			<div class="mt-10 flex flex-row items-center gap-4">
				<ButtonText text="Yes" onClick={onYes} />
				<ButtonText text="Close" onClick={onClose} />
			</div>
		</div>
	</div>
</section>
