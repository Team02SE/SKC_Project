<script lang="ts">
	import ButtonSvg from "./ButtonSvg.svelte";

    export let title: string = "Conclusion";
    export let content: string = "Description";
</script>

<div class="mb-2">
    <div class="flex gap-4 items-end mb-2">
        <h3 class="text-3xl font-semibold">{title}</h3>
        <ButtonSvg type="edit" size={6} customClass="mb-1"/>
    </div>
    <div class="bg-light-hovered-primary p-4 rounded-2xl flex flex-col gap-5">
        <p>{content}</p>
    </div>
</div>