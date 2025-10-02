<script>
	import ButtonSvg from "./ButtonSvg.svelte";

    export let title = "Title";
	export let content = "Description";
</script>

<div class="w-full">
	<h3 class="mb-2 text-3xl font-bold">{title}</h3>
	<div class="flex items-center justify-between">
		<p>{content}</p>
		<ButtonSvg type="edit" size={6} customClass="inline-block ml-2" />
	</div>
</div>
