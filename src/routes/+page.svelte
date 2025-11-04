<script>
	import Header from '$lib/components/Header.svelte';
	import DocumentCard from '$lib/components/DocumentCard.svelte';
	import ButtonSvg from '$lib/components/ButtonSvg.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import UploadComplete from '$lib/components/UploadComplete.svelte';
	import DocumentInfo from '$lib/components/DocumentInfo.svelte';

	let { data } = $props();
</script>

<!-- <UploadComplete/> -->
<div class="flex h-18 w-full items-center justify-between p-4">
	<div class="flex h-full flex-1 justify-end gap-2">
		<SearchBar />
		<FilterBar />
	</div>
</div>

<div class="flex w-full gap-5 px-4 py-2">
	<div class="h-full w-5/12 overflow-y-visible rounded-2xl bg-light-primary inset-shadow-sm/25">
		{#each data.documetns as workflowDocument, index}
			<DocumentCard {workflowDocument} roundedTop={index == 0} />
		{/each}
	</div>
	<div
		class="flex flex-1 items-stretch justify-center rounded-2xl bg-light-primary inset-shadow-sm/25"
	>
		<DocumentInfo />
	</div>
</div>
