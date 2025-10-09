<script lang="ts">
	import ButtonSvg from "./ButtonSvg.svelte";

    export let title: string | undefined = undefined;
    export let content: string | undefined = undefined;
</script>

<div class="mb-2">
    <div class="flex gap-4 items-end mb-2">
        {#if title}
            <h3 class="text-3xl font-semibold">{title}</h3>
            <ButtonSvg type="edit" size={6} customClass="mb-1"/>
        {/if}
    </div>
    <textarea
        bind:value={content}
        placeholder="Search..."
        class="min-h-[120px] w-full resize-none rounded-2xl border-0 bg-transparent px-5 py-3 text-lg text-light-text-primary placeholder-light-text-primary/50 shadow-md/25 outline-none"
    ></textarea>
</div>