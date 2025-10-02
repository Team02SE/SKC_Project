<script>
	import Header from '$lib/components/Header.svelte';
    import DocumentCard from '$lib/components/DocumentCard.svelte';
    import ButtonSvg from '$lib/components/ButtonSvg.svelte';
    import SearchBar from '$lib/components/SearchBar.svelte';
    import FilterBar from '$lib/components/FilterBar.svelte';
    import UploadComplete from '$lib/components/UploadComplete.svelte';
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

<div class="flex py-2 px-4 h-[calc(100vh-160px)] w-full gap-5">
    <div class="bg-light-primary inset-shadow-sm/25 w-5/12 h-full rounded-2xl">
        <DocumentCard roundedTop={true}/>
        <DocumentCard/>
        <DocumentCard/>
        <DocumentCard/>
        <DocumentCard/>
    </div>
    <div class="bg-light-primary inset-shadow-sm/25 flex-1 rounded-2xl flex justify-center items-center">
        <p class="text-light-text-primary opacity-25 text-4xl">Select a document to see its preview</p>
    </div>
</div>