<script lang="ts">
	import type { Coding } from '$lib/types';
	import more from '$lib/assets/three-dots-circle.svg';

	import DropdownList from './../DropdownList/DropdownList.svelte';

	interface Props {
		coding: Coding;
		onCodingSelected: (c: Coding) => void;
		onCodingNodeAdded: (parentId: number | null) => void;
		onCodingDeleted: (coding: Coding) => void;
	}
	let { coding, onCodingSelected, onCodingNodeAdded, onCodingDeleted }: Props = $props();
</script>

<div
	class="flex w-full flex-row items-center gap-1 rounded-2xl bg-white text-start font-bold shadow-md"
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
		<button class="mr-10 duration-100 hover:scale-110" onclick={(e) => { e.stopPropagation(); coding.isOptionsOpen = !coding.isOptionsOpen; }}>
			<img src={more} alt="more" class="h-10 w-10" />
		</button>

		{#if coding.isOptionsOpen}
			<DropdownList rootNode={coding} onCodingNodeAdded={onCodingNodeAdded} onCodingDeleted={onCodingDeleted} onClose={() => coding.isOptionsOpen = false} />
		{/if}
	</div>
</div>