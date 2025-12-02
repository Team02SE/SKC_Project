<script lang="ts">
	import ButtonSvg from './ButtonSvg.svelte';
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// selectedId comes from parent so scroll position can control the active item
	export let selectedId: 'essence' | 'activities' | 'effects' | 'destep' | 'opportunity-structures' | 'system-vulnerabilities' | null = null;
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
	class="m-5 flex h-150 w-20 flex-col items-center gap-4 text-2xl font-semibold text-light-primary text-center"
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

	<div class="flex flex-col space-y-4 mt-12 mb-8">
		<div class="flex flex-col items-center space-y-2">
			<button
				class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
				style="background-color: var(--color-light-secondary);"
				aria-label="ERD View"
			>
				<svg class="w-6 h-6" style="color: var(--color-light-button-content-primary);" fill="currentColor" viewBox="0 0 20 20">
					<path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
				</svg>
			</button>
		</div>

		<div class="flex flex-col items-center space-y-2">
			<button
				class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
				style="background-color: var(--color-light-active-primary);"
				aria-label="Save"
			>
				<svg class="w-8 h-8" style="color: var(--color-light-button-content-primary);" fill="none" viewBox="0 0 24 24">
					<path d="M7 21H17C19.2091 21 21 19.2091 21 17V7.41421C21 7.149 20.8946 6.89464 20.7071 6.70711L17.2929 3.29289C17.1054 3.10536 16.851 3 16.5858 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9 3H15V6C15 6.55228 14.5523 7 14 7H10C9.44772 7 9 6.55228 9 6V3Z" stroke="white" stroke-width="2"/>
					<path d="M17 21V14C17 13.4477 16.5523 13 16 13H8C7.44772 13 7 13.4477 7 14V21" stroke="white" stroke-width="2"/>
					<path d="M11 17H13" stroke="white" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>
		</div>
	</div>
</div>
