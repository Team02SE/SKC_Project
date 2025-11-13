<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import CodingTabs from '$lib/components/CodingTabs.svelte';
	import ButtonSvg from '$lib/components/ButtonSvg.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import TreeView from '$lib/components/TreeView/TreeView.svelte';
	import type { PageProps } from './$types';
	import type { Coding } from '$lib/types';
	import { fade } from 'svelte/transition';
	import CodingsEdit from '$lib/components/CodingsEddit/CodingsEdit.svelte';

	let { data }: PageProps = $props();

	let codings = $state(data);

	export function GetCodings() {
		return codings;
	}

	let searchQuery = $state('');

	function deleteRecursively(codings: Coding[], codingToDelete: Coding): Coding[] {
		return codings.filter((coding) => {
			if (coding.id === codingToDelete.id) {
				return false;
			}
			if (coding.children && coding.children.length > 0) {
				coding.children = deleteRecursively(coding.children, codingToDelete);
			}

			return true;
		});
	}

	// Maps tab IDs to their display titles and corresponding data keys in the codings object
	const tabConfig = {
		activities: { title: 'Activities', key: 'activities' as const },
		effects: { title: 'Effects', key: 'effects' as const },
		'opportunity-structures': { title: 'Opportunity structures', key: 'opportunityStructures' as const },
		'system-vulnerabilities': { title: 'System vulnerabilities', key: 'systemVulnerabilities' as const },
		dsteps: { title: 'Dsteps', key: 'dsteps' as const }
	};

	type TabKey = keyof typeof tabConfig;

	let selectedTab = $state<TabKey>('activities');
	let codingToEdit = $state<Coding | undefined>(undefined);

	// Automatically derive the title based on the selected tab
	let selectedCodingTitle = $derived(tabConfig[selectedTab].title);

	function OnTabChange(tab: string) {
		if (tab in tabConfig) {
			selectedTab = tab as TabKey;
		}
	}

	function handleSearch(event: CustomEvent<string>) {
		searchQuery = event.detail;
	}

	function getSelectedCodings(): Coding[] {
		const key = tabConfig[selectedTab].key;
		return codings[key] || [];
	}

	function filterCodingTree(nodes: Coding[], query: string): Coding[] {
		if (!query) {
			return nodes;
		}

		const loweredQuery = query.toLowerCase();

		return nodes.reduce<Coding[]>((acc, node) => {
			const children = Array.isArray(node.children) ? filterCodingTree(node.children, query) : [];
			const matchesNode = node.name?.toLowerCase().includes(loweredQuery);

			if (matchesNode || children.length > 0) {
				acc.push({
					...node,
					children
				});
			}

			return acc;
		}, []);
	}

	function getFilteredCodings(): Coding[] {
		return filterCodingTree(getSelectedCodings(), searchQuery.trim());
	}

	function OnCodingSelected(coding: Coding) {
		codingToEdit = coding;
	}

	function OnCodingDeleted(coding: Coding) {
		const key = tabConfig[selectedTab].key;
		codings = {
			...codings,
			[key]: deleteRecursively(codings[key], coding)
		};

		if (codingToEdit?.id === coding.id) {
			codingToEdit = undefined;
		}
	}
</script>

<!-- <UploadComplete/> -->
<div class="flex h-18 w-full items-center justify-between p-4">
	<CodingTabs onTabChange={OnTabChange} />

	<div class="flex h-full flex-1 justify-end gap-2">
		<SearchBar on:search={handleSearch} />
<!--		<FilterBar />-->
	</div>
</div>

<!-- Example usage -->
<section class="flex h-full w-full gap-2">
	<div class="h-full w-1/2">
		<TreeView
			onCodingSelected={OnCodingSelected}
			label={selectedCodingTitle}
			rootNodes={getFilteredCodings()}
		/>
	</div>
	<div
		class="mt-4 mr-4 flex h-[100vh] w-1/2 flex-col items-center rounded-2xl bg-white shadow inset-shadow-sm/25"
	>
		<CodingsEdit
			onCodingDeleted={OnCodingDeleted}
			coding={codingToEdit}
			type={selectedCodingTitle}
		/>
	</div>
</section>
