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

	// TODO: use teh data to create codings
	let { data }: PageProps = $props();

	let codings = $state(data);

	export function GetCodings() {
		return codings;
	}

	let selectedCoding = $state(codings.activities);
	let selectedCodingTitle = $state('Activities');
	let codingToEdit = $state(undefined);

	// console.warn(codings);
	function SelectCorrectCodingsData(tab: string): Coding[] {
		switch (tab) {
			case 'activities':
				selectedCodingTitle = 'Activities';
				return codings.activities;
			case 'effects':
				selectedCodingTitle = 'Effects';
				return codings.effects;
			case 'opportunity-structures':
				selectedCodingTitle = 'Opportunity structures';
				return codings.opportunityStructures;
			case 'system-vulnerabilities':
				selectedCodingTitle = 'System vulnerabilities';
				return codings.systemVulnerabilities;
			case 'dsteps':
				selectedCodingTitle = 'Dsteps';
				return codings.dsteps;
			default:
				return [];
		}
	}

	function OnTabChange(tab: string) {
		selectedCoding = SelectCorrectCodingsData(tab);
	}

	function OnCodingSelected(coding: Coding) {
		codingToEdit = coding;
	}

	function OnCodingDeleted(coding: Coding) {
		console.log(coding);
	}
</script>

<!-- <UploadComplete/> -->
<div class="flex h-18 w-full items-center justify-between p-4">
	<CodingTabs onTabChange={OnTabChange} />

	<div class="flex h-full flex-1 justify-end gap-2">
		<SearchBar />
		<FilterBar />
	</div>
</div>

<!-- Example usage -->
<section class="flex h-full w-full gap-2">
	<div class="h-full w-1/2">
		<TreeView
			onCodingSelected={OnCodingSelected}
			label={selectedCodingTitle}
			rootNodes={selectedCoding}
		/>
	</div>
	<div
		class="mt-4 mr-4 flex h-[100vh] w-1/2 flex-col items-center rounded-2xl bg-white shadow inset-shadow-sm/25"
	>
		<CodingsEdit
			onCodingDelete={OnCodingDeleted}
			coding={codingToEdit}
			type={selectedCodingTitle}
		/>
	</div>
</section>
