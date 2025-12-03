<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';

	interface MenuItem {
		label: string;
		onClick: () => void;
		className?: string;
	}

	interface Props {
		menuItems: MenuItem[];
		onClose?: () => void;
		position?: 'right' | 'center';
		customClass?: string;
	}
	
	let { 
		menuItems,
		onClose,
		position = 'right',
		customClass = ''
	}: Props = $props();

	let el: HTMLElement | null = null;

	function onDocumentClick(e: MouseEvent) {
		if (!el) return;
		const target = e.target as Node | null;
		if (target && !el.contains(target)) {
			if (onClose) {
				onClose();
			}
		}
	}

	onMount(() => {
		window.addEventListener('click', onDocumentClick);
	});

	onDestroy(() => {
		window.removeEventListener('click', onDocumentClick);
	});

	let positionClass = $derived(position === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0');
</script>

<div
	bind:this={el}
	class="absolute {positionClass} w-40 bg-white rounded-2xl shadow-lg z-50 p-2 {customClass}"
	style="top:100%"
	role="menu"
	aria-orientation="vertical"
	transition:slide
>
	{#each menuItems as item}
		<button
			class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-150 {item.className || ''}"
			role="menuitem"
			onclick={item.onClick}
		>
			{item.label}
		</button>
	{/each}
</div>
