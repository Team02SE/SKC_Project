<script>
	import ButtonSvg from "./ButtonSvg.svelte";

    export let roundedTop = false;
</script>

<div class={`flex h-32 w-full items-end justify-between bg-light-hovered-primary p-5 inset-shadow-sm/25 ${roundedTop ? 'rounded-t-2xl' : ''}`}>
	<div>
		<div class="mb-2 flex items-center gap-4">
			<h2 class="text-3xl font-semibold">DOCUMENT_NAME</h2>
			<div class="h-4 w-4 rounded-full bg-green-500"></div>
		</div>
		<p>Status: STATUS</p>
		<p>Last modified: DATE</p>
	</div>
    <div class="flex gap-4">
        <ButtonSvg type="eye"/>
        <ButtonSvg type="edit"/>
        <ButtonSvg type="trash"/>
    </div>
</div>
