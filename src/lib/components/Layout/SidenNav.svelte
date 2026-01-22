<script lang="ts">
	import ButtonSvg from '../Buttons/ButtonSvg.svelte';
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// selectedId comes from parent so scroll position can control the active item
	export let selectedId:
		| 'essence'
		| 'activities'
		| 'effects'
		| 'destep'
		| 'opportunity-structures'
		| 'system-vulnerabilities'
		| null = null;
	let hoveredId: string | null = null;

	const navItems = [
		{ id: 'essence', initial: 'E', label: 'Essence' },
		{ id: 'activities', initial: 'A', label: 'Activities' },
		{ id: 'effects', initial: 'E', label: 'Effects' },
		{ id: 'destep', initial: 'D', label: 'DESTEP' },
		{ id: 'opportunity-structures', initial: 'O', label: 'Opportunity structures' },
		{ id: 'system-vulnerabilities', initial: 'S', label: 'System vulnerabilities' }
	];
</script>

<div
	class="m-5 flex h-150 w-20 flex-col items-center gap-4 text-center text-2xl font-semibold text-light-primary"
>
	{#each navItems as item (item.id)}
		<div class="relative flex flex-col items-center" animate:flip>
			<button
				type="button"
				aria-label={item.label}
				on:mouseenter={() => (hoveredId = item.id)}
				on:mouseleave={() => (hoveredId = null)}
				on:focus={() => (hoveredId = item.id)}
				on:blur={() => (hoveredId = null)}
				on:click={() => dispatch('selectSection', item.id)}
				class={`flex h-15 w-15 transform items-center justify-center rounded-full transition-all duration-200 hover:scale-110 focus:scale-110 ${selectedId === item.id ? 'bg-light-active-primary' : 'bg-light-secondary'}`}
			>
				<span class="pointer-events-none">{item.initial}</span>
			</button>

			{#if hoveredId === item.id || selectedId === item.id}
				<div class="mt-2 text-sm text-light-text-primary" transition:slide={{ duration: 180 }}>
					<span transition:fade>{item.label}</span>
				</div>
			{/if}
		</div>
	{/each}

	<div class="mt-12 mb-8 flex flex-col space-y-4">
		<div class="flex flex-col items-center space-y-2">
			<!--
			<button
				class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none"
				style="background-color: var(--color-light-secondary);"
				aria-label="ERD View"
			>
				 <svg class="w-6 h-6" style="color: var(--color-light-button-content-primary);" fill="currentColor" viewBox="0 0 20 20">
					<path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
				</svg> 
			</button>
			-->
		</div>
	</div>
</div>
