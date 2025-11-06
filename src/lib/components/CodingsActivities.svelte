<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";
    import type { Activity } from "$lib/types";

    let { data }: { data: Activity[] } = $props();
    
    let n1Activities = $derived(data.filter(activity => !activity.parent_id));
</script>

<div class="mb-50">
    <h1 class="text-4xl font-bold text-light-text-primary">Activities</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">N1</h2>
            {#each n1Activities as activity}
                <TreeCodings data={{
                    title: activity.name,
                    label: activity.number.toString(),
                    children: activity.children.map(child => ({
                        title: child.name,
                        label: child.number.toString(),
                        buttonIcon: 'close'
                    }))
                }} />
            {/each}
        </div>
        
        <div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">Add N1 Activity</h2>
            <AddCoding />
        </div>
    </div>
</div>