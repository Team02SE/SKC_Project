<script lang="ts">
	import TreeCodings from './TreeCodings.svelte';
	import AddCoding from './AddCoding.svelte';
	import AddSubCoding from './AddSubCoding.svelte';
	import type { Activity } from '$lib/types';
	import { codingToCodingData, getAllCodingIds } from '$lib';

	interface Props {
		data: Activity[];
		availableCodings?: Activity[];
		documentId?: number;
		onCodingAdded?: (coding: Activity) => void;
	}

	let { data, availableCodings = data, documentId, onCodingAdded }: Props = $props();

	let n1Activities = $derived(data.filter((activity) => !activity.parent_id));
	let existingCodingIds = $derived(getAllCodingIds(data));

    let showAddSubCoding = $state(false);
	let addSubCodingParentId = $state<number | null>(null);

	let availableChildCodings = $derived.by(() => {
		if (!addSubCodingParentId || !availableCodings) return [];
		
		const parentCoding = availableCodings.find(c => c.id === addSubCodingParentId);
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

	function handleSubCodingAdded(coding: Activity) {
		if (onCodingAdded) {
			const parentId = addSubCodingParentId;
			if (parentId) {
				const newSubCoding: Activity = {
					...coding,
					parent_id: parentId,
					isNew: true,
					children: null
				};
				onCodingAdded(newSubCoding);
			}
		}
		handleCloseAddSub();
	}
</script><div class="mb-50 relative">
	<h1 class="text-4xl font-bold text-light-text-primary">Activities</h1>
	<div class="flex h-full w-full gap-30">
		<div class="h-full w-1/2">
			<h2 class="mb-2 text-2xl font-semibold text-light-text-primary">N1</h2>
			{#each n1Activities as activity}
				<TreeCodings 
					data={codingToCodingData(activity)} 
					type='activities'
					codingId={activity.id}
					onAddSubRequest={handleAddSubRequest}
				/>
			{/each}
		</div>

		<div class="h-full w-1/2">
			<h2 class="mb-2 text-2xl font-semibold text-light-text-primary">Add N1 Activity</h2>
			<AddCoding 
				type="activities"
				availableCodings={availableCodings}
				documentId={documentId}
				excludeCodingIds={existingCodingIds}
				onCodingAdded={onCodingAdded}
			/>
		</div>
	</div>

	{#if showAddSubCoding}
		<AddSubCoding 
			type="activities" 
			parentId={addSubCodingParentId}
			availableCodings={availableChildCodings}
			documentId={documentId}
			excludeCodingIds={existingCodingIds}
			onClose={handleCloseAddSub}
			onCodingAdded={handleSubCodingAdded}
		/>
	{/if}
</div>
