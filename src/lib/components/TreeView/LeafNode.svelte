<script lang="ts">
	import type { Coding } from '$lib/types';
	import more from '$lib/assets/three-dots-circle.svg';
	import DropdownList from './../DropdownList/DropdownList.svelte';
	import { toastStore } from '../PopUps/Toast/toastStore.svelte';
	import { dropdownState } from '$lib/utils/dropdownState.svelte';

	interface Props {
		coding: Coding;
		onCodingSelected: (c: Coding) => void;
		onCodingNodeAdded: (parentId: number | null) => void;
		onCodingDeleted: (coding: Coding) => void;
	}
	let { coding, onCodingSelected, onCodingNodeAdded, onCodingDeleted }: Props = $props();

	let dropdownId = $derived(`leaf-${coding.type}-${coding.id}`);
	let isOpen = $derived(dropdownState.isOpen(dropdownId));

	function handleAdd() {
		onCodingNodeAdded(coding.id ?? null);
		dropdownState.close(dropdownId);
	}

	async function handleDelete() {
		const response = await fetch(`/codings/${coding.id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type: coding.type })
		});

		let responseBody = await response.text();

		if (response.ok) {
			toastStore.success(`"${coding.name}" deleted successfully`);
			onCodingDeleted(coding);
		} else {
			toastStore.error(responseBody);
		}
		dropdownState.close(dropdownId);
	}

	let menuItems = $derived([
		{ label: 'Add', onClick: handleAdd },
		{ label: 'Delete', onClick: handleDelete, className: 'text-red-600' }
	]);
</script>

<div class="flex w-full flex-row items-center gap-1 rounded-2xl bg-white text-start shadow-md">
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
	<div class="relative mr-10 inline-block">
		<button
			class="duration-100 hover:scale-110"
			onclick={(e) => {
				e.stopPropagation();
				dropdownState.toggle(dropdownId);
			}}
		>
			<img src={more} alt="more" class="h-10 w-10" />
		</button>

		{#if isOpen}
			<DropdownList {menuItems} onClose={() => dropdownState.close(dropdownId)} />
		{/if}
	</div>
</div>
