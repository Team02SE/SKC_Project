<script lang="ts">
	import AddCoding from './AddCoding.svelte';
	import type { Activity, Coding } from '$lib/types';

	export let type:
		| 'activities'
		| 'effects'
		| 'opportunity-structures'
		| 'system-vulnerabilities'
		| 'destep';
	export let parentId: number | null = null;
	export let availableCodings: Activity[] = [];
	export let documentId: number | undefined = undefined;
	export let excludeCodingIds: Set<number> | undefined = undefined;
	export let onClose: (() => void) | undefined = undefined;
	export let onCodingAdded: ((coding: Coding) => void) | undefined = undefined;

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && onClose) {
			onClose();
		}
	}

	function handleModalKeydown(e: KeyboardEvent) {
		e.stopPropagation();
	}
</script>

<div
	class="absolute inset-0 z-30 flex items-center justify-center bg-black/20"
	role="button"
	tabindex="0"
	onclick={onClose}
	onkeydown={handleOverlayKeydown}
>
	<div
		class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => e.stopPropagation()}
		onkeydown={handleModalKeydown}
	>
		<div class="mb-4 flex items-center justify-between">
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
		<AddCoding
			type={type}
			{availableCodings}
			{documentId}
			{parentId}
			{excludeCodingIds}
			{onCodingAdded}
			autoOpenDropdown={true}
		/>
	</div>
</div>