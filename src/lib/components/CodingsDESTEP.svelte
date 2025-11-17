<script lang="ts">
    import TreeCodings from './TreeCodings.svelte';
	import AddCoding from './AddCoding.svelte';
	import type { DStep } from "$lib/types";
	import { codingToCodingData } from '$lib';

	let { data }: { data: DStep[] } = $props();

    let n1Dstep = $derived(data.filter(dstep => !dstep.parent_id));
</script>

<div class="mb-50">
    <h1 class="text-4xl font-bold text-light-text-primary">DESTEP</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            {#each n1Dstep as dstep}
                <TreeCodings data={codingToCodingData(dstep)} type='dsteps'/>
            {/each}
        </div>
        <div class="h-full w-1/2">
            <AddCoding />
        </div>
    </div>
        
    <!-- <h1 class="text-4xl font-bold text-light-text-primary">Major influence</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            Ignoring this for now for later discussion
            {#each majorInfluenceItems as item}
                <CardCodings title={item.name} label={item.number.toString()} />
            {/each}
        </div>
        <div class="h-full w-1/2">
            <AddCoding />
        </div>
    </div> -->
</div>

