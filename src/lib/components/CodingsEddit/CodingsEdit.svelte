<script lang="ts">
	import type { Coding } from '$lib/types';

	interface Props {
		coding: Coding | undefined;
	}
	let { coding }: Props = $props();
</script>

<div
	class="shadow-inner-2xl flex h-full w-full flex-col items-center justify-center bg-light-primary"
>
	{#if coding != undefined}
		<h1>{coding.name}</h1>
		<h2>{coding.description}</h2>
		<h2>{coding.number}</h2>
	{/if}
</div>
