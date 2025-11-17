<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";
	import Textbox from "./Textbox.svelte";
    import type { SystemVulnerability } from "$lib/types";
    import { codingToCodingData } from '$lib';

    let { data }: { data: SystemVulnerability[] } = $props();

    // Filter for top-level vulnerabilities (those without parent_id)
    let topLevelVulnerabilities = $derived(data.filter(item => !item.parent_id));
</script>

<div class="mb-50">
    <h1 class="text-4xl font-bold text-light-text-primary">System Vulnerabilities - Clustering</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            {#each topLevelVulnerabilities as vulnerability}
            <TreeCodings data={codingToCodingData(vulnerability)} type='system-vulnerabilities' />
            {/each}
        </div>

        <div class="h-full w-1/2">
            <AddCoding />
        </div>
    </div>

    <!-- <h1 class="text-4xl font-bold text-light-text-primary">System Vulnerabilities</h1>
    <Textbox /> -->
</div>