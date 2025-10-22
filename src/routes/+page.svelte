<script>
	import Header from '$lib/components/Header.svelte';
    import DocumentCard from '$lib/components/DocumentCard.svelte';
    import ButtonSvg from '$lib/components/ButtonSvg.svelte';
    import SearchBar from '$lib/components/SearchBar.svelte';
    import FilterBar from '$lib/components/FilterBar.svelte';
    import UploadComplete from '$lib/components/UploadComplete.svelte';
    import DocumentInfo from '$lib/components/DocumentInfo.svelte';

    const workflows = [1,2,3,4,5,6,7,8,9,10, 11, 22,33]
</script>

<!-- <UploadComplete/> -->
<div class="h-18 w-full p-4 flex justify-between items-center">
    <ButtonSvg type="home" size={12}/>
    <div class="flex flex-1 justify-end h-full gap-2">
        <SearchBar/>
        <FilterBar/>
    </div>
</div>

<div class="flex  py-2 px-4 w-full gap-5">
    <div class="bg-light-primary h-full inset-shadow-sm/25 w-5/12 overflow-y-visible rounded-2xl ">
        {#each workflows as i, index }
            <DocumentCard id={i}  roundedTop={ index == 0 }/>
        {/each}
    </div>
    <div class="bg-light-primary inset-shadow-sm/25 flex-1 rounded-2xl flex justify-center items-stretch">
        <DocumentInfo/>
    </div>
</div>