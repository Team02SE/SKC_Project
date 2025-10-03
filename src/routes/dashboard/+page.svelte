<script>
	import Header from '$lib/components/Header.svelte';
    import ButtonSvg from '$lib/components/ButtonSvg.svelte';
    import SearchBar from '$lib/components/SearchBar.svelte';
    import FilterBar from '$lib/components/FilterBar.svelte';
</script>

<Header/>
<!-- <UploadComplete/> -->
<div class="h-18 w-full p-4 flex justify-between items-center">
    <ButtonSvg type="home" size={12}/>
    <div class="flex flex-1 justify-end h-full gap-2">
        <SearchBar/>
        <FilterBar/>
    </div>
</div>