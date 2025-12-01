<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { Coding } from "$lib/types";

	interface Props {
		rootNode: Coding;
		onCodingNodeAdded: (parentId: number | null) => void;
		onCodingDeleted: (coding: Coding) => void;
	}
	let { rootNode, onCodingNodeAdded, onCodingDeleted }: Props = $props();

	let el: HTMLElement | null = null;

	function handleAdd() {
		onCodingNodeAdded(rootNode.id ?? null);
		rootNode.isOptionsOpen = false;
	}

	async function handleDelete() {
		const response = await fetch(`/codings/${rootNode.id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type: rootNode.type })
		});

		if (response.ok) {
			rootNode.isOptionsOpen = false;
			onCodingDeleted(rootNode);
		} else {
			console.error('Delete failed:', response.statusText);
		}
	}

	function onDocumentClick(e: MouseEvent) {
		if (!el) return;
		const target = e.target as Node | null;
		if (target && !el.contains(target)) {
			rootNode.isOptionsOpen = false;
		}
	}

	onMount(() => {
		window.addEventListener('click', onDocumentClick);
	});

	onDestroy(() => {
		window.removeEventListener('click', onDocumentClick);
	});
</script>

<div
	bind:this={el}
	class="absolute right-0 w-40 bg-white rounded-lg shadow-md z-50"
	style="top:100%"
	role="menu"
	aria-orientation="vertical"
	transition:slide
>
	<button
		class="block w-full text-left px-4 py-2 hover:bg-gray-100"
		role="menuitem"
		onclick={handleAdd}
	>
		Add
	</button>

	<button
		class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
		role="menuitem"
		onclick={handleDelete}
	>
		Delete
	</button>
</div>
