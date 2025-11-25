<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";
    import type { Effect } from "$lib/types";
    import { codingToCodingData, getAllCodingIds } from '$lib';

	interface Props {
        data: Effect[];
        availableCodings?: Effect[];
        documentId?: number;
        onCodingAdded?: (coding: Effect) => void;
    }

    let { data, availableCodings = data, documentId, onCodingAdded }: Props = $props();    let n1Effects = $derived(data.filter(effect => !effect.parent_id));
    let existingCodingIds = $derived(getAllCodingIds(data));
</script>

<div class="mb-50">
    <h1 class="text-4xl font-bold text-light-text-primary">Effects</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">N1</h2>
            {#each n1Effects as effect}
                <TreeCodings data={codingToCodingData(effect)} type='effects'/>
            {/each}
        </div>
		<div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">Add N1 Effect</h2>
            <AddCoding 
                type="effects"
                availableCodings={availableCodings}
                documentId={documentId}
                excludeCodingIds={existingCodingIds}
                onCodingAdded={onCodingAdded}
            />
        </div>
    </div>
</div>
