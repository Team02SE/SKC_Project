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
    export let type: 'activities' | 'effects' | 'opportunity-structures' | 'system-vulnerabilities' | 'dsteps';
    console.warn(data);
</script>

<div class="flex h-auto w-full flex-col gap-3 mb-5">
    <CardCodings title={data.title} label={data.label} buttonIcon={data.buttonIcon}/>
    <div class="ml-5">
        {#if data.children && data.children.length > 0}
            <p class="text-sm italic font-semibold text-light-text-primary/50">sub-{type}</p>
            <div class="flex flex-col gap-2 mt-2">
                {#each data.children ?? [] as child}
                    <CardCodings title={child.title} label={child.label} buttonIcon={child.buttonIcon}/>
                {/each}
            </div>
        {/if}
    </div>
</div>