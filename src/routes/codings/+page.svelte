<script lang="ts">
	import CodingTabs from '$lib/components/Codings/Management/CodingTabs.svelte';
	import CodingsEdit from '$lib/components/Codings/Management/CodingsEdit.svelte';
	import SearchBar from '$lib/components/Search/SearchBar.svelte';
	import TreeView from '$lib/components/TreeView/TreeView.svelte';
	import type { Coding } from '$lib/types';
	import type { PageProps } from './$types';
	import { normalizeCodingTypes } from '$lib/utils/coding/codingHelpers';

	let { data }: PageProps = $props();

	let codings = $state({
		activities: normalizeCodingTypes(data.allCodings?.activities || []),
		effects: normalizeCodingTypes(data.allCodings?.effects || []),
		destep: normalizeCodingTypes(data.allCodings?.destep || []),
		'opportunity-structures': normalizeCodingTypes(data.allCodings?.['opportunity-structures'] || []),
		'system-vulnerabilities': normalizeCodingTypes(data.allCodings?.['system-vulnerabilities'] || [])
	});

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

	const tabConfig = {
		activities: { title: 'Activities', key: 'activities' as const },
		effects: { title: 'Effects', key: 'effects' as const },
		'opportunity-structures': {
			title: 'Opportunity structures',
			key: 'opportunity-structures' as const
		},
		'system-vulnerabilities': {
			title: 'System vulnerabilities',
			key: 'system-vulnerabilities' as const
		},
		destep: { title: 'Destep', key: 'destep' as const }
	};

	type TabKey = keyof typeof tabConfig;

	let selectedTab = $state<TabKey>('activities');
	let codingToEdit = $state<Coding | undefined>(undefined);

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
		isCreateForm = false;
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

	let isCreateForm = $state(false);

	function handleAddOption(parent_id: number) {
		isCreateForm = true;

		codingToEdit = {
			id: -1,
			parent_id,
			name: '',
			description: '',
			number: 0,
			type: selectedCodingTitle.toLowerCase(),
			children: [],
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
	}
</script>

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
			onCodingNodeAdded={handleAddOption}
			onCodingDeleted={OnCodingDeleted}
		/>
	</div>
	<div
		class="mt-4 mr-4 flex h-[100vh] w-1/2 flex-col items-center rounded-2xl bg-white shadow inset-shadow-sm/25"
	>
		<CodingsEdit
			onCodingDeleted={OnCodingDeleted}
			coding={codingToEdit}
			type={selectedCodingTitle}
			{isCreateForm}
			onCreated={() => {
				codingToEdit = undefined;
				isCreateForm = false;
			}}
		/>
	</div>
</section>