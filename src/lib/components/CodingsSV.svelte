<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";
	import Textbox from "./Textbox.svelte";
    import type { SystemVulnerability } from "$lib/types";

    let { data }: { data: SystemVulnerability[] } = $props();

    // Filter for top-level vulnerabilities (those without parent_id)
    let topLevelVulnerabilities = $derived(data.filter(item => !item.parent_id));
</script>

<div class="mb-50">
    <h1 class="text-4xl font-bold text-light-text-primary">System Vulnerabilities - Clustering</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            {#each topLevelVulnerabilities as vulnerability}
            <TreeCodings data={{
                title: vulnerability.name,
                label: vulnerability.number.toString(),
                children: vulnerability.children.map(child => ({
                    title: child.name,
                    label: child.number.toString(),
                    buttonIcon: "close"
                }))
            }} />
            {/each}
        </div>

        <div class="h-full w-1/2">
            <AddCoding />
        </div>
    </div>

    <h1 class="text-4xl font-bold text-light-text-primary">System Vulnerabilities</h1>
    <Textbox />
</div>