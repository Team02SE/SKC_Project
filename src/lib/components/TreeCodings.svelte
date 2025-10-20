<script context="module" lang="ts">
    export interface CodingData {
        title: string;
        label: string;
        buttonIcon?: string;
        children?: CodingData[];
    }
</script>

<script lang="ts">
    import CardCodings from "./CardCodings.svelte";

    export let data: CodingData;
</script>

<div class="flex h-auto w-full flex-col gap-3 mb-10">
    <CardCodings title={data.title} label={data.label} buttonIcon={data.buttonIcon}/>
    <div class="ml-5">
        <p class="text-sm italic font-semibold text-light-text-primary/50">#TOFIX WHEN FULL DOC JSON</p>
        <div class="flex flex-col gap-2 mt-2">
            {#each data.children ?? [] as child}
                <CardCodings title={child.title} label={child.label} buttonIcon={child.buttonIcon}/>
            {/each}
        </div>
    </div>
</div>