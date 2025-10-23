<script lang="ts">
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

<!-- <UploadComplete/> -->
<div class="h-18 w-full p-4 flex justify-between items-center">
	<ButtonSvg type="home" size={12}/>
	<div class="flex flex-1 justify-end h-full gap-2">
		<SearchBar/>
		<FilterBar/>
	</div>
</div>

<!-- Example usage -->
<!-- <section class="h-full w-full flex-col">
	<TreeView label="Activities" rootNodes={codings.activities} />
</section> -->