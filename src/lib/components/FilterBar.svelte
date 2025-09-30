<script>
	import ButtonSvg from "./ButtonSvg.svelte";
</script>
<div class="w-auto h-full inset-shadow-sm/25 rounded-4xl flex items-center">
    <ButtonSvg type="filter" customClass="p-1 ml-2"/>
    <input type="text" placeholder="Search..." class="flex-1 border-0 bg-transparent outline-none px-5 text-light-text-primary placeholder-light-text-primary/50 text-lg rounded-4xl"/>
    <ButtonSvg type="dropdown" customClass="p-1 mr-2"/>
</div>