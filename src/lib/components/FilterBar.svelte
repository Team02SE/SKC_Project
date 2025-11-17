<script lang="ts">
	import { onMount } from 'svelte';
	import ButtonSvg from './ButtonSvg.svelte';
	import { createEventDispatcher } from 'svelte';

	type StatusValue = 0 | 1 | 2;
	type SortOption = 'lastModified-asc' | 'lastModified-desc' | null;

	const dispatch = createEventDispatcher<{
		filter: StatusValue[];
		sort: SortOption;
	}>();

	const statusOptions: { value: StatusValue; label: string; color: string }[] = [
		{ value: 0, label: 'Not started', color: 'bg-red-500' },
		{ value: 1, label: 'In progress', color: 'bg-orange-500' },
		{ value: 2, label: 'Finished', color: 'bg-green-500' }
	];

	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: 'lastModified-desc', label: 'Newest' },
		{ value: 'lastModified-asc', label: 'Oldest' },
		{ value: null, label: 'No Sorting' }
	];

	let isOpen = $state(false);
	let selectedStatuses = $state<StatusValue[]>([]);
	let selectedSort: SortOption = $state('lastModified-desc');
	let rootElement: HTMLDivElement | null = null;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleDropdownClick(event: MouseEvent) {
		event.stopPropagation();
		toggleDropdown();
	}

	function toggleStatus(value: StatusValue) {
		if (selectedStatuses.includes(value)) {
			selectedStatuses = selectedStatuses.filter((status) => status !== value);
		} else {
			selectedStatuses = [...selectedStatuses, value];
		}

		dispatch('filter', selectedStatuses);
	}

	function clearFilters() {
		selectedStatuses = [];
		dispatch('filter', selectedStatuses);
	}

	function handleClearClick() {
		clearFilters();
		isOpen = false;
	}

	function selectSort(option: SortOption) {
		selectedSort = option;
		dispatch('sort', selectedSort);
	}

	function closeDropdown(event: MouseEvent) {
		if (!rootElement) return;
		if (!rootElement.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	onMount(() => {
		window.addEventListener('click', closeDropdown);
		return () => window.removeEventListener('click', closeDropdown);
	});

	function summaryLabel() {
		if (selectedStatuses.length === 0) {
			return 'Filter';
		}

		const labels = statusOptions
			.filter((option) => selectedStatuses.includes(option.value))
			.map((option) => option.label);

		return labels.join(', ');
	}
</script>

<div
	class="relative w-auto h-full flex items-center"
	bind:this={rootElement}
>
	<button
		type="button"
		class="w-90 flex h-full items-center gap-2 rounded-4xl bg-light-primary px-4 inset-shadow-sm/25 border border-transparent hover:border-light-text-primary/20 transition-colors"
		onclick={handleDropdownClick}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
	>
		<ButtonSvg type="filter" customClass="p-1" />
		<div class="flex-1"></div>
		<span class="text-sm font-medium text-light-text-primary whitespace-nowrap">{summaryLabel()}</span>
		<ButtonSvg
			type="dropdown"
			customClass={`p-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
		/>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl bg-light-primary p-3 shadow-lg inset-shadow-sm/25 border border-light-text-primary/10"
		>
			<div class="mb-4">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-semibold text-light-text-primary">Filters</span>
					<button
						type="button"
						class="text-xs text-blue-600 hover:underline"
						onclick={handleClearClick}
					>
						Clear all
					</button>
				</div>

				<ul class="flex flex-col gap-1" role="listbox" aria-label="Filter by status">
					{#each statusOptions as option}
						<li>
							<label
								class="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-light-text-primary/5"
							>
								<input
									type="checkbox"
									class="h-4 w-4 rounded border-light-text-primary/40 text-blue-600 focus:ring-blue-500"
									checked={selectedStatuses.includes(option.value)}
									onchange={() => toggleStatus(option.value)}
								/>
								<span class="flex items-center gap-2">
									<span class={`h-2 w-2 rounded-full ${option.color}`}></span>
									{option.label}
								</span>
							</label>
						</li>
					{/each}
				</ul>
			</div>

			<div class="border-t border-light-text-primary/10 pt-3">
				<div class="mb-2">
					<span class="text-sm font-semibold text-light-text-primary">Sort by</span>
				</div>

				<ul class="flex flex-col gap-1" role="listbox" aria-label="Sort documents">
					{#each sortOptions as option}
						<li>
							<button
								type="button"
								class="w-full flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-left transition-colors hover:bg-light-text-primary/5 {selectedSort === option.value
									? 'bg-blue-50 text-blue-700'
									: 'text-light-text-primary'}"
								onclick={() => selectSort(option.value)}
							>
								<input
									type="radio"
									class="h-4 w-4 border-light-text-primary/40 text-blue-600 focus:ring-blue-500"
									checked={selectedSort === option.value}
									readonly
								/>
								{option.label}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</div>