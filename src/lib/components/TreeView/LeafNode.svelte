<script lang="ts">
	import type { Coding } from '$lib/types';
	import more from '$lib/assets/three-dots-circle.svg';
	import DropdownList from './../DropdownList/DropdownList.svelte';
	import { toastStore } from '../PopUps/Toast/toastStore.svelte';

	interface Props {
		coding: Coding;
		onCodingSelected: (c: Coding) => void;
		onCodingNodeAdded: (parentId: number | null) => void;
		onCodingDeleted: (coding: Coding) => void;
	}
	let { coding, onCodingSelected, onCodingNodeAdded, onCodingDeleted }: Props = $props();

	function handleAdd() {
		onCodingNodeAdded(coding.id ?? null);
		coding.isOptionsOpen = false;
	}

	async function handleDelete() {
		const response = await fetch(`/codings/${coding.id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type: coding.type })
		});

		if (response.ok) {
			toastStore.success(`"${coding.name}" deleted successfully`);
			onCodingDeleted(coding);
		} else {
			console.error('Delete failed:', response.statusText);
			toastStore.error('Failed to delete coding');
		}
		coding.isOptionsOpen = false;
	}

	let menuItems = $derived([
		{ label: 'Add', onClick: handleAdd },
		{ label: 'Delete', onClick: handleDelete, className: 'text-red-600' }
	]);
</script>

<div
	class="flex w-full flex-row items-center gap-1 rounded-2xl bg-white text-start shadow-md"
>
	<div class="ml-4 w-full flex-col items-start p-1">
		<button
			class="flex w-full flex-col items-start"
			onclick={() => {
				onCodingSelected(coding);
			}}
		>
			<h2 class="text-2xl font-normal"><b>{coding.number}</b> {coding.name}</h2>
			<div class="flex-3 flex-col gap-0 text-xs font-normal opacity-55">
				<p class="m-0 leading-tight">Last edited:</p>
				<p class="m-0 leading-tight">Description:</p>
			</div>
		</button>
	</div>
	<div class="relative inline-block mr-10">
		<button class="duration-100 hover:scale-110" onclick={(e) => { e.stopPropagation(); coding.isOptionsOpen = !coding.isOptionsOpen; }}>
			<img src={more} alt="more" class="h-10 w-10" />
		</button>

		{#if coding.isOptionsOpen}
			<DropdownList 
				{menuItems}
				onClose={() => coding.isOptionsOpen = false} 
			/>
		{/if}
	</div>
</div>