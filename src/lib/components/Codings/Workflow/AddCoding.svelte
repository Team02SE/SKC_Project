<script lang="ts">
	import ButtonSvg from '../../Buttons/ButtonSvg.svelte';
	import type { Coding } from '$lib/types';

	interface Props {
		customClass?: string;
		type: string;
		availableCodings?: Coding[];
		excludeCodingIds?: Set<number>;
		onCodingAdded?: (coding: Coding) => void;
		parentId?: number | null;
		autoOpenDropdown?: boolean;
	}

	let { customClass = '', type, availableCodings = [], excludeCodingIds, onCodingAdded, parentId, autoOpenDropdown = false }: Props = $props();

	let isDropdownOpen = $state(autoOpenDropdown);
	let searchQuery = $state('');

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
		if (onCodingAdded) {
			const codingWithoutChildren = {
				...coding,
				children: null
			};
			onCodingAdded(codingWithoutChildren);
		}
		
		// Reset state
		isDropdownOpen = false;
		searchQuery = '';
	}
</script>

<div class={`flex flex-col w-full gap-2 ${customClass}`}>
	<div class="relative">
		{#if !autoOpenDropdown}
			<button
				type="button"
				onclick={toggleDropdown}
				class="flex h-10 w-full items-center rounded-2xl shadow-md/25 hover:shadow-md transition-shadow"
			>
				<p class="flex-1 pl-4 font-medium text-left text-light-text-primary/50">
					Add existing coding...
				</p>
				<ButtonSvg type="dropdown" size={6} customClass="mr-2 ml-auto" asChild={true} />
			</button>
		{/if}

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


</div>
