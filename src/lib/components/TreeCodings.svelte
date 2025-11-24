<script context="module" lang="ts">
    export interface CodingData {
        id: number;
        title: string;
        label: string;
        buttonIcon?: string;
        children?: CodingData[];
        isNew?: boolean;
        isDeleted?: boolean;
    }
</script>

<script lang="ts">
    import CardCodings from "./CardCodings.svelte";

    export let data: CodingData;
    export let type: 'activities' | 'effects' | 'opportunity-structures' | 'system-vulnerabilities' | 'dsteps';
    export let codingId: number | undefined = undefined;
    export let onAddSubRequest: ((parentId: number) => void) | undefined = undefined;
    export let onDeleteRequest: ((codingId: number) => void) | undefined = undefined;
</script>

<div class="flex h-auto w-full flex-col gap-3 mb-5">
    <CardCodings 
        title={data.title} 
        label={data.label} 
        buttonIcon={data.buttonIcon} 
        isNew={data.isNew}
        isDeleted={data.isDeleted}
        type={type}
        codingId={codingId}
        onAddSubRequest={onAddSubRequest}
        onDeleteRequest={onDeleteRequest}
    />
    <div class="ml-5">
        {#if data.children && data.children.length > 0}
            <p class="text-sm italic font-semibold text-light-text-primary/50">sub-{type}</p>
            <div class="flex flex-col gap-2 mt-2">
                {#each data.children ?? [] as child}
                    <svelte:self 
                        data={child} 
                        {type} 
                        codingId={child.id}
                        {onAddSubRequest}
                        {onDeleteRequest}
                    />
                {/each}
            </div>
        {/if}
    </div>
</div>