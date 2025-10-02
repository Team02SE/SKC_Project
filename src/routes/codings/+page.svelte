<script>
	import Header from '$lib/components/Header.svelte';
	import ButtonSvg from '$lib/components/ButtonSvg.svelte';
	import CodingsEssence from '$lib/components/CodingsEssence.svelte';
</script>

<Header />
<div class="flex h-18 w-full items-center p-4 sticky top-20">
    <ButtonSvg type="home" size={12} />
    <div class="w-px h-10 bg-light-text-primary mx-4"></div>
    <div class="bg-light-navbar-primary h-full w-64 rounded-t-2xl flex justify-center items-center">
		<p class="text-light-primary text-medium font-medium px-1">Editing - DOCUMENT_NAME</p>
	</div>
</div>

<div class="flex w-full gap-5 px-4 py-2">
	<div class="sticky top-40 h-[calc(100vh-160px)] w-56 bg-green-500"></div>

	<!-- middle content -->
	<div class="h-full w-5/12 rounded-2xl bg-light-primary p-5 inset-shadow-sm/25">
		<CodingsEssence />
		<CodingsEssence />
		<CodingsEssence />
		<CodingsEssence />
	</div>

	<!-- right content -->
	<div class="p-20 flex-1 sticky top-24 h-[calc(100vh-110px)] flex items-center justify-center rounded-2xl bg-light-primary inset-shadow-sm/25">
		<p class="text-4xl text-light-text-primary opacity-25">Select a document to see its preview</p>
	</div>
</div>