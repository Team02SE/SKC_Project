<script lang="ts">
	import ButtonSvg from './ButtonSvg.svelte';
	import ButtonText from './ButtonText.svelte';
	import type { Coding } from '$lib/types';

	interface Props {
		customClass?: string;
		type: string;
		availableCodings?: Coding[];
		documentId?: number;
		excludeCodingIds?: Set<number>;
		onCodingAdded?: (coding: Coding) => void;
		parentId?: number | null;
	}

	let { customClass = '', type, availableCodings = [], documentId, excludeCodingIds, onCodingAdded, parentId }: Props = $props();

	let isDropdownOpen = $state(false);
	let searchQuery = $state('');
	let selectedCoding = $state<Coding | null>(null);

	let filteredCodings = $derived(
		(availableCodings || [])
			.filter(coding => parentId !== null && parentId !== undefined ? true : !coding.parent_id)
			.filter(coding => !excludeCodingIds || !excludeCodingIds.has(coding.id))
			.filter(coding => 
				coding.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				coding.number.toString().includes(searchQuery)
			)
	);

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function selectCoding(coding: Coding) {
		selectedCoding = coding;
		isDropdownOpen = false;
		searchQuery = '';
	}

	function handleAdd() {
		if (!selectedCoding || !onCodingAdded) return;
		
		onCodingAdded(selectedCoding);
		selectedCoding = null;
	}
</script>

<div class={`flex flex-col gap-2 ${customClass}`}>
	<div class="relative">
		<button
			type="button"
			onclick={toggleDropdown}
			class="flex h-10 w-full items-center rounded-2xl shadow-md/25 hover:shadow-md transition-shadow"
		>
			<p class="flex-1 pl-4 font-medium text-left {selectedCoding ? 'text-light-text-primary' : 'text-light-text-primary/50'}">
				{selectedCoding ? `${selectedCoding.number} - ${selectedCoding.name}` : 'Select coding...'}
			</p>
			<ButtonSvg type="dropdown" size={6} customClass="mr-2 ml-auto" />
		</button>

		{#if isDropdownOpen}
			<div class="absolute z-10 mt-2 w-full max-h-80 overflow-y-auto rounded-2xl bg-white shadow-lg border border-gray-200">
				<div class="sticky top-0 bg-white p-2 border-b border-gray-200">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search codings..."
						class="h-10 w-full rounded-xl border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-light-button-primary"
					/>
				</div>

				<div class="p-2">
					{#if filteredCodings.length === 0}
						<p class="text-center text-sm text-gray-500 py-4">No codings found</p>
					{:else}
						{#each filteredCodings as coding}
							<button
								type="button"
								onclick={() => selectCoding(coding)}
								class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<div class="font-medium text-light-text-primary">
									{coding.number} - {coding.name}
								</div>
								{#if coding.description}
									<div class="text-xs text-gray-500 mt-1 truncate">
										{coding.description}
									</div>
								{/if}
							</button>
						{/each}
					{/if}
				</div>
			</div>
		{/if}
	</div>

	{#if selectedCoding}
		<div class="mt-2 p-4 rounded-xl bg-gray-50 border border-gray-200">
			<h3 class="text-sm font-semibold text-light-text-primary mb-1">Selected:</h3>
			<p class="text-lg font-medium text-light-text-primary">{selectedCoding.number} - {selectedCoding.name}</p>
			{#if selectedCoding.description}
				<p class="text-sm text-gray-600 mt-2">{selectedCoding.description}</p>
			{/if}
		</div>
	{/if}

	<!-- Add button -->
	<div class="flex justify-end">
		<ButtonText
			text="Add"
			customClass="text-sm bg-light-button-primary rounded-md w-20 {!selectedCoding ? 'opacity-50 cursor-not-allowed' : ''}"
			onClick={handleAdd}
		/>
	</div>
</div>
