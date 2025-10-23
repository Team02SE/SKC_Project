<script lang="ts">

	import NavBar from '$lib/components/NavBar.svelte';
	import CodingTabs from '$lib/components/CodingTabs.svelte';
  import ButtonSvg from '$lib/components/ButtonSvg.svelte';
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

<div class="flex-1 p-4">
	<CodingTabs/>
</div>

<!-- Example usage -->
<!-- <section class="h-full w-full flex-col">
	<TreeView label="Activities" rootNodes={codings.activities} />
</section> -->