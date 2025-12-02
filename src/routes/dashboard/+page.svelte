<script>
	import SearchBar from '$lib/components/Search/SearchBar.svelte';
	import FilterBar from '$lib/components/Search/FilterBar.svelte';
</script>

<div class="flex h-18 w-full items-center justify-between p-4">
	<div class="flex h-full flex-1 justify-end gap-2">
		<SearchBar />
		<FilterBar />
	</div>
</div>
