<script>
	import Header from '$lib/components/Header.svelte';
    import ButtonSvg from '$lib/components/ButtonSvg.svelte';
    import CodingsEssence from '$lib/components/CodingsEssence.svelte';
</script>

<Header/>
<div class="h-18 w-full p-4 flex justify-between items-center">
    <ButtonSvg type="home" size={12}/>
</div>

<div class="flex py-2 px-4 h-[calc(100vh-160px)] w-full gap-5">
    <div class="bg-green-500 w-56 h-full"></div>
    <div class="bg-light-primary inset-shadow-sm/25 w-5/12 h-full rounded-2xl p-5">
        <CodingsEssence/>
    </div>
    <div class="bg-light-primary inset-shadow-sm/25 flex-1 rounded-2xl flex justify-center items-center">
        <p class="text-light-text-primary opacity-25 text-4xl">Select a document to see its preview</p>
    </div>
</div>