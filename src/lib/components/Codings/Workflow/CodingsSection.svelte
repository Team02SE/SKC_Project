<script lang="ts">
	import TreeCodings from '../Management/TreeCodings.svelte';
	import AddCoding from './AddCoding.svelte';
	import AddSubCoding from './AddSubCoding.svelte';
	import type { Coding } from '$lib/types';
	import { codingToCodingData, getAllCodingIds, findCodingById } from '$lib/utils/coding/codingHelpers';
	import AddNewCoding from './AddNewCoding.svelte';

	interface Props {
		title: string;
		type: 'activities' | 'effects' | 'opportunity-structures' | 'system-vulnerabilities' | 'destep';
		data: Coding[];
		availableCodings?: Coding[];
		documentId?: number;
		onCodingAdded?: (coding: Coding) => void;
		onDeleteRequest?: (codingId: number) => void;
		onCancelRequest?: (codingId: number) => void;
	}

	let {
		title,
		type,
		data,
		availableCodings = data,
		documentId,
		onCodingAdded,
		onDeleteRequest,
		onCancelRequest
	}: Props = $props();

	let topLevelCodings = $derived(data.filter((coding) => !coding.parent_id));
	let existingCodingIds = $derived(getAllCodingIds(data));

	let showAddSubCoding = $state(false);
	let addSubCodingParentId = $state<number | null>(null);
	let showAddNewCoding = $state(false);

	let availableChildCodings = $derived.by(() => {
		if (!addSubCodingParentId || !availableCodings) return [];
		const parentCoding = findCodingById(availableCodings, addSubCodingParentId);
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

	function handleCloseAddNew() {
		showAddNewCoding = false;
	}

	function handleNewCodingCreated(coding: Coding) {
		if (onCodingAdded) {
			onCodingAdded(coding);
		}
		handleCloseAddNew();
	}
</script>

<div class="relative mb-50">
	<h1 class="text-4xl font-bold text-light-text-primary">{title}</h1>
	<div class="flex h-full w-full gap-30">
		<div class="flex w-full gap-5">
			<div class="flex w-full max-w-1/2 flex-col gap-2">
				{#each topLevelCodings as coding (coding.id)}
					<TreeCodings
						data={codingToCodingData(coding)}
						type={type}
						codingId={coding.id}
						onAddSubRequest={handleAddSubRequest}
						{onDeleteRequest}
						{onCancelRequest}
					/>
				{/each}
			</div>
			<div class="flex flex-1 flex-col gap-2 items-end">
				<AddCoding
					type={type}
					{availableCodings}
					excludeCodingIds={existingCodingIds}
					{onCodingAdded}
				/>
				<button
					type="button"
					onclick={() => { showAddNewCoding = true;}}
					class="flex items-center gap-2 px-4 py-2 bg-light-button-primary text-white rounded-xl hover:brightness-110 transition shadow-md hover:shadow-lg w-auto"
				>
					<span class="font-semibold text-sm">+ New Coding</span>
				</button>
			</div>
		</div>
	</div>	

	{#if showAddSubCoding}
		<AddSubCoding
			type={type}
			parentId={addSubCodingParentId}
			availableCodings={availableChildCodings}
			excludeCodingIds={existingCodingIds}
			onClose={handleCloseAddSub}
			onCodingAdded={handleSubCodingAdded}
		/>
	{/if}

	{#if showAddNewCoding}
		<AddNewCoding
			type={type}
			isOpen={showAddNewCoding}
			onClose={handleCloseAddNew}
			onCodingCreated={handleNewCodingCreated}
		/>
	{/if}
</div>
