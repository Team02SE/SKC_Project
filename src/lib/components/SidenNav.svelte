<script lang="ts">
	import ButtonSvg from './ButtonSvg.svelte';
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// selectedId comes from parent so scroll position can control the active item
	export let selectedId: 'essence' | 'activities' | 'effects' | 'destep' | 'opportunity' | 'vulnerabilities' | null = null;
	let hoveredId: string | null = null;

	const navItems = [
		{ id: 'essence', initial: 'E', label: 'Essence' },
		{ id: 'activities', initial: 'A', label: 'Activities' },
		{ id: 'effects', initial: 'E', label: 'Effects' },
		{ id: 'destep', initial: 'D', label: 'DESTEP' },
		{ id: 'opportunity', initial: 'O', label: 'Opportunity systems' },
		{ id: 'vulnerabilities', initial: 'S', label: 'System vulnerabilities' }
	];
</script>

<div
	class="mt-5 flex h-150 w-56 flex-col items-center gap-4 text-2xl font-semibold text-light-primary"
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
	<div class="rounded-xl bg-light-secondary">
		<ButtonSvg type="node" size={12} customClass="p-2" />
	</div>
	<div class="rounded-xl bg-light-active-primary">
		<ButtonSvg type="save" size={12} customClass="p-2" />
	</div>
</div>
