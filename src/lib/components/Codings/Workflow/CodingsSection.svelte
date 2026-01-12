<script lang="ts">
	import TreeCodings from '../Management/TreeCodings.svelte';
	import AddCoding from './AddCoding.svelte';
	import AddSubCoding from './AddSubCoding.svelte';
	import type { Coding } from '$lib/types';
	import {
		codingToCodingData,
		getAllCodingIds,
		findCodingById
	} from '$lib/utils/coding/codingHelpers';
	import AddNewCoding from './AddNewCoding.svelte';
	import AddReason from './AddReason.svelte';

	interface Props {
		title: string;
		type: 'activities' | 'effects' | 'opportunity-structures' | 'system-vulnerabilities' | 'destep';
		data: Coding[];
		availableCodings?: Coding[];
		documentId?: number;
		onCodingAdded?: (coding: Coding) => void;
		onDeleteRequest?: (codingId: number) => void;
		onCancelRequest?: (codingId: number) => void;
		onResonAddedRequest?: (reason: string) => void;
	}

	let {
		title,
		type,
		data,
		availableCodings = data,
		documentId,
		onCodingAdded,
		onDeleteRequest,
		onCancelRequest,
		onResonAddedRequest
	}: Props = $props();

	let topLevelCodings = $derived(data.filter((coding) => !coding.parent_id));
	let existingCodingIds = $derived(getAllCodingIds(data));

	let showAddSubCoding = $state(false);
	let addSubCodingParentId = $state<number | null>(null);
	let showAddNewCoding = $state(false);
	let showAddReason = $state(false);
	let selectedReason = $state('');

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

	function handleAddReson(codingId: number, reason: string) {
		showAddReason = true;
		if (onResonAddedRequest) {
			onResonAddedRequest(reason);
		}

		console.log(reason);
		selectedReason = reason;
	}

	function handleReasonChanged(newReason: string) {
		console.log(newReason);
	}

	function handleReasonClosed() {
		showAddReason = false;
	}

	function handleNewCodingCreated(coding: Coding) {
		if (onCodingAdded) {
			onCodingAdded(coding);
		}
		handleCloseAddNew();
	}
</script>

<div class="relative mb-10">
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
						{onDeleteRequest}
						{onCancelRequest}
						onAddReasonRequest={handleAddReson}
					/>
				{/each}
			</div>
			<div class="flex flex-1 flex-col items-end gap-2">
				<AddCoding {type} {availableCodings} excludeCodingIds={existingCodingIds} {onCodingAdded} />
				<button
					type="button"
					onclick={() => {
						showAddNewCoding = true;
					}}
					class="flex w-auto items-center gap-2 rounded-xl bg-light-button-primary px-4 py-2 text-white shadow-md transition hover:shadow-lg hover:brightness-110"
				>
					<span class="text-sm font-semibold">+ New Coding</span>
				</button>
			</div>
		</div>
	</div>

	{#if showAddSubCoding}
		<AddSubCoding
			{type}
			parentId={addSubCodingParentId}
			availableCodings={availableChildCodings}
			excludeCodingIds={existingCodingIds}
			onClose={handleCloseAddSub}
			onCodingAdded={handleSubCodingAdded}
		/>
	{/if}

	{#if showAddNewCoding}
		<AddNewCoding
			{type}
			isOpen={showAddNewCoding}
			onClose={handleCloseAddNew}
			onCodingCreated={handleNewCodingCreated}
		/>
	{/if}

	{#if showAddReason}
		<AddReason
			sectionId={0}
			reason={selectedReason}
			onClose={handleReasonClosed}
			onReasonChange={handleReasonChanged}
		/>
	{/if}
</div>
