<script lang="ts">
	import Header from '$lib/components/Layout/Header.svelte';
	import DocumentCard from '$lib/components/Cards/DocumentCard.svelte';
	import SearchBar from '$lib/components/Search/SearchBar.svelte';
	import FilterBar from '$lib/components/Search/FilterBar.svelte';
	import DocumentInfo from '$lib/components/Documents/DocumentInfo.svelte';
	import type { WorkflowDocument } from '$lib/types';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data } = $props();

	let searchQuery = $state('');
	let statusFilter = $state<number[]>([]);
	let sortOption: 'lastModified-asc' | 'lastModified-desc' | null = $state('lastModified-desc');
	let selectedDocument = $state<WorkflowDocument | null>(null);

	function getFilteredDocuments() {
		let filtered = data.documents;

		if (searchQuery.length > 0) {
			const normalizedQuery = searchQuery.toLowerCase();
			filtered = filtered.filter((document) =>
				document.Title?.toLowerCase().includes(normalizedQuery)
			);
		}

		if (statusFilter.length > 0) {
			filtered = filtered.filter((document) => statusFilter.includes(document.Status));
		}

		if (sortOption) {
			filtered = [...filtered].sort((a, b) => {
				const dateA = new Date(a.UpdatedAt).getTime();
				const dateB = new Date(b.UpdatedAt).getTime();

				if (sortOption === 'lastModified-desc') {
					return dateB - dateA;
				} else if (sortOption === 'lastModified-asc') {
					return dateA - dateB;
				}
				return 0;
			});
		}

		return filtered;
	}

	const filteredDocuments = $derived(getFilteredDocuments());

	$effect(() => {
		if (filteredDocuments.length === 0) {
			if (selectedDocument !== null) {
				selectedDocument = null;
			}
			return;
		}

		if (!selectedDocument) {
			selectedDocument = filteredDocuments[0];
			return;
		}

		if (!filteredDocuments.some((doc) => doc.id === selectedDocument?.id)) {
			selectedDocument = filteredDocuments[0];
		}
	});

	function handleSearch(event: CustomEvent<string>) {
		searchQuery = event.detail;
	}

	function handleFilter(event: CustomEvent<number[]>) {
		statusFilter = event.detail;
	}

	function handleSort(event: CustomEvent<'lastModified-asc' | 'lastModified-desc' | null>) {
		sortOption = event.detail;
	}

	function handleDocumentDeleted(doc: WorkflowDocument) {
		if (selectedDocument?.id === doc.id) {
			selectedDocument = null;
		}
	}
</script>

<div class="flex h-18 w-full items-center justify-between p-4">
	<div class="flex h-full flex-1 justify-end gap-2">
		<SearchBar on:search={handleSearch} />
		<FilterBar on:filter={handleFilter} on:sort={handleSort} />
	</div>
</div>

<div class="flex w-full gap-5 px-4 py-2">
	<div class="h-full w-5/12 overflow-y-visible rounded-2xl bg-light-primary inset-shadow-sm/25">
		{#each getFilteredDocuments() as workflowDocument, index}
			<DocumentCard {workflowDocument} roundedTop={index == 0} />
		{/each}
	</div>
	<div
		class="flex flex-1 items-stretch justify-center rounded-2xl bg-light-primary inset-shadow-sm/25"
	>
		<DocumentInfo />
	</div>
</div>
