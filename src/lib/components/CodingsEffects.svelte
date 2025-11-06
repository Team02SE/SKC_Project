<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";
    import type { Effect } from "$lib/types";

    let { data }: { data: Effect[] } = $props();
    
    let n1Effects = $derived(data.filter(effect => !effect.parent_id));
</script>

<div class="mb-50">
    <h1 class="text-4xl font-bold text-light-text-primary">Effects</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">N1</h2>
            {#each n1Effects as effect}
                <TreeCodings data={{
                    title: effect.name,
                    label: effect.number.toString(),
                    children: effect.children.map(child => ({
                        title: child.name,
                        label: child.number.toString()
                    }))
                }} />
            {/each}
        </div>
        <div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">Add N1 Effect</h2>
            <AddCoding />
        </div>
    </div>
</div>
