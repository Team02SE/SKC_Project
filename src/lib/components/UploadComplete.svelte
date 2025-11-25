<script>
	import ButtonSvg from './ButtonSvg.svelte';
	import ButtonText from './ButtonText.svelte';
	import MetadataCard from './MetadataCard.svelte';
</script>

<div class="fixed top-0 left-0 h-screen w-screen bg-black opacity-50"></div>
<div
	class="fixed top-1/2 left-1/2 z-10 flex h-4/5 w-3/4 -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-light-primary"
>
	<ButtonSvg type="cloudUpload" size={12} customClass="absolute top-5 left-5 cursor-pointer" />
	<div class="mt-5 flex h-1/12 w-full flex-col items-center justify-center gap-2">
		<h2 class="text-3xl font-semibold">Upload Completed!</h2>
		<p>AI Summary</p>
	</div>
	<div class="mx-5 mb-5 flex flex-1 gap-2 rounded-2xl bg-light-hovered-primary px-5 py-5">
		<div class="flex flex-col gap-4 border-r-2 border-light-text-primary/50 pr-20">
			<MetadataCard title="Title" content="DOCUMENT_NAME" />
			<MetadataCard title="Date" content="DATE" />
			<MetadataCard title="Author" content="AUTHOR" />
			<MetadataCard title="Organisation" content="ORGANISATION" />
			<MetadataCard title="Language" content="LANGUAGE" />
		</div>
		<div class="px-5">
			<div class="mb-16 flex items-end gap-8">
				<h3 class="text-3xl font-bold">Summary</h3>
				<ButtonSvg type="edit" size={6} />
			</div>
			<p>
				Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
				pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
				aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
				Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class
				aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem
				ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
				pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
				aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
				Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class
				aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
			</p>
		</div>
		<div class="fixed right-10 bottom-10 flex items-center gap-5">
			<ButtonText text="Start workflow" />
			<ButtonSvg type="home" size={12} />
		</div>
	</div>
</div>