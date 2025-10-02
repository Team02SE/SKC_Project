<script>
	import ButtonSvg from "./ButtonSvg.svelte";
    import ButtonText from "./ButtonText.svelte";
    import MetadataCard from "./MetadataCard.svelte";
</script>
<div class="h-screen w-screen fixed bg-black opacity-50 left-0 top-0"></div>
<div class="z-10 flex flex-col w-3/4 h-4/5 bg-light-primary rounded-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <ButtonSvg type="cloudUpload" size={12} customClass="absolute top-5 left-5 cursor-pointer"/>
    <div class="w-full h-1/12 mt-5 flex items-center justify-center flex-col gap-2">
        <h2 class="text-3xl font-semibold">Upload Completed!</h2>
        <p>AI Summary</p>
    </div>
    <div class="mx-5 mb-5 px-5 py-5 flex gap-2 flex-1 rounded-2xl bg-light-hovered-primary">
        <div class="flex flex-col gap-4 pr-20 border-r-2 border-light-text-primary/50">
            <MetadataCard title="Title" content="DOCUMENT_NAME" />
            <MetadataCard title="Date" content="DATE" />
            <MetadataCard title="Author" content="AUTHOR" />
            <MetadataCard title="Organisation" content="ORGANISATION" />
            <MetadataCard title="Language" content="LANGUAGE" />
        </div>
        <div class="px-5">
            <div class="flex gap-8 items-end mb-16">
                <h3 class="text-3xl font-bold">Summary</h3>
                <ButtonSvg type="edit" size={6}/>
            </div>
            <p>
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
            </p>
        </div>
        <div class="fixed right-10 bottom-10 flex items-center gap-5">
            <ButtonText text="Start workflow"/>
            <ButtonSvg type="home" size={12}/>
        </div>
    </div>
</div>