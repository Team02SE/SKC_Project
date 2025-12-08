<script lang="ts">
	import AddCoding from './AddCoding.svelte';
	import AddNewCoding from './AddNewCoding.svelte';
	import type { Activity, Coding } from '$lib/types';

	interface Props {
		type:
			| 'activities'
			| 'effects'
			| 'opportunity-structures'
			| 'system-vulnerabilities'
			| 'destep';
		parentId?: number | null;
		availableCodings?: Activity[];
		excludeCodingIds?: Set<number>;
		onClose?: () => void;
		onCodingAdded?: (coding: Coding) => void;
	}

	let {
		type,
		parentId = null,
		availableCodings = [],
		excludeCodingIds = undefined,
		onClose = undefined,
		onCodingAdded = undefined
	}: Props = $props();

	let showNewCodingModal = $state(false);

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && onClose) {
			onClose();
		}
	}

	function handleModalKeydown(e: KeyboardEvent) {
		e.stopPropagation();
	}

	function openNewCodingModal() {
		showNewCodingModal = true;
	}

	function closeNewCodingModal() {
		showNewCodingModal = false;
	}

	function handleNewCodingCreated(coding: Coding) {
		showNewCodingModal = false;
		if (onCodingAdded) {
			onCodingAdded(coding);
		}
	}
</script>

<div
	class="absolute inset-0 z-30 flex items-center justify-center"
	role="button"
	tabindex="0"
	onclick={onClose}
	onkeydown={handleOverlayKeydown}
>
	<div
		class="w-full max-w-2xl h-[450px] flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden mx-4 translate-y-5/11"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => e.stopPropagation()}
		onkeydown={handleModalKeydown}
	>
		<div class="p-6 pb-4 flex items-center justify-between border-b border-gray-200">
			<h3 class="text-xl font-semibold text-light-text-primary">Add sub-{type}</h3>
			{#if onClose}
				<button
					class="text-2xl leading-none text-gray-500 hover:text-gray-700"
					onclick={onClose}
					aria-label="Close"
				>
					×
				</button>
			{/if}
		</div>
		
		<div class="py-2 px-4 flex-1 overflow-y-auto">
			<!-- Create new coding section -->
			<div class="flex justify-end">
				<button
					type="button"
					onclick={openNewCodingModal}
					class="flex h-10 px-4 items-center rounded-2xl shadow-md/25 hover:shadow-md transition-shadow bg-light-button-primary text-white hover:brightness-110"
				>
					<span class="font-medium">
						+ Create New Sub-{type.charAt(0).toUpperCase() + type.slice(1)}
					</span>
				</button>
			</div>

			<!-- Add existing coding section -->
			<div class="">
				<AddCoding
					type={type}
					{availableCodings}
					{parentId}
					{excludeCodingIds}
					{onCodingAdded}
					autoOpenDropdown={true}
				/>
			</div>
		</div>
	</div>
</div>

<!-- AddNewCoding Modal -->
<AddNewCoding
	{type}
	parentId={parentId}
	isOpen={showNewCodingModal}
	onClose={closeNewCodingModal}
	onCodingCreated={handleNewCodingCreated}
/>