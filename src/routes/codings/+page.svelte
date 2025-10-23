<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ButtonSvg from '$lib/components/ButtonSvg.svelte';
	import CodingsEssence from '$lib/components/CodingsEssence.svelte';
	import SidenNav from '$lib/components/SidenNav.svelte';
	import CodingsActivities from '$lib/components/CodingsActivities.svelte';
	import CodingsEffects from '$lib/components/CodingsEffects.svelte';
	import CodingsDESTEP from '$lib/components/CodingsDESTEP.svelte';
	import CodingsOS from '$lib/components/CodingsOS.svelte';
	import CodingsSV from '$lib/components/CodingsSV.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import TreeView from '$lib/components/TreeView/TreeView.svelte';
	import type { PageProps } from './$types';

  // TODO: use teh data to create codings
	let { data }: PageProps = $props();

	let codings = $state(data);

	export function GetCodings() {
		return codings;
	}
</script>

<!-- <UploadComplete/> -->
<div class="h-18 w-full p-4 flex justify-between items-center">
	<ButtonSvg type="home" size={12}/>
	<div class="flex flex-1 justify-end h-full gap-2">
		<SearchBar/>
		<FilterBar/>
	</div>
</div>
