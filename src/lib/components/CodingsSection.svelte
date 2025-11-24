<script lang="ts">
	import TreeCodings from './TreeCodings.svelte';
	import AddCoding from './AddCoding.svelte';
	import AddSubCoding from './AddSubCoding.svelte';
	import type { Coding } from '$lib/types';
	import { codingToCodingData, getAllCodingIds } from '$lib';

	interface Props {
		title: string;
		type: 'activities' | 'effects' | 'opportunity-structures' | 'system-vulnerabilities' | 'dsteps';
		data: Coding[];
		availableCodings?: Coding[];
		documentId?: number;
		onCodingAdded?: (coding: Coding) => void;
	}

	let { title, type, data, availableCodings = data, documentId, onCodingAdded }: Props = $props();

	let topLevelCodings = $derived(data.filter((coding) => !coding.parent_id));
	let existingCodingIds = $derived(getAllCodingIds(data));

	let showAddSubCoding = $state(false);
	let addSubCodingParentId = $state<number | null>(null);

	let availableChildCodings = $derived.by(() => {
		if (!addSubCodingParentId || !availableCodings) return [];

		const parentCoding = availableCodings.find((c) => c.id === addSubCodingParentId);
		return parentCoding?.children || [];
	});

	function handleAddSubRequest(parentId: number) {
		addSubCodingParentId = parentId;
		showAddSubCoding = true;
	}

	function handleCloseAddSub() {
		showAddSubCoding = false;
		addSubCodingParentId = null;
	}

	function handleSubCodingAdded(coding: Coding) {
		if (onCodingAdded) {
			const newSubCoding = {
				...coding,
				parent_id: addSubCodingParentId ?? undefined,
				isNew: true
			};

			onCodingAdded(newSubCoding);
		}

		handleCloseAddSub();
	}
</script>

<div class="mb-50 relative">
	<h1 class="text-4xl font-bold text-light-text-primary">{title}</h1>
	<div class="flex h-full w-full gap-30">
		<div class="flex w-full gap-5">
			<div class="flex w-full max-w-1/2 flex-col gap-2">
				{#each topLevelCodings as coding (coding.id)}
					<TreeCodings
						data={codingToCodingData(coding)}
						{type}
						codingId={coding.id}
						onAddSubRequest={handleAddSubRequest}
					/>
				{/each}
			</div>
			<AddCoding
				{type}
				availableCodings={availableCodings}
				{documentId}
				excludeCodingIds={existingCodingIds}
				onCodingAdded={onCodingAdded}
			/>
		</div>
	</div>

	{#if showAddSubCoding}
		<AddSubCoding
			{type}
			parentId={addSubCodingParentId}
			availableCodings={availableChildCodings}
			{documentId}
			excludeCodingIds={existingCodingIds}
			onClose={handleCloseAddSub}
			onCodingAdded={handleSubCodingAdded}
		/>
	{/if}
</div>
