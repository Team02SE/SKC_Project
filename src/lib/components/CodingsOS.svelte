<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";
    import type { OpportunityStructure } from "$lib/types";
    import { codingToCodingData, getAllCodingIds } from '$lib';

	interface Props {
        data: OpportunityStructure[];
        availableCodings?: OpportunityStructure[];
        documentId?: number;
        onCodingAdded?: (coding: OpportunityStructure) => void;
    }

    let { data, availableCodings = data, documentId, onCodingAdded }: Props = $props();    let sectors = $derived(data.filter(item => !item.parent_id));
    let existingCodingIds = $derived(getAllCodingIds(data));
    
    // let structures = $derived(data.map(item => item.name));
</script>

<div class="mb-50">
    <h1 class="text-4xl font-bold text-light-text-primary">Opportunity Structures</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            {#each sectors as sector}
            <TreeCodings data={codingToCodingData(sector)} type='opportunity-structures'/>
            {/each}
        </div>
		<div class="h-full w-1/2">
            <AddCoding 
                type='opportunity-structures'
                availableCodings={availableCodings}
                documentId={documentId}
                excludeCodingIds={existingCodingIds}
                onCodingAdded={onCodingAdded}
            />
        </div>
    </div>

    <!-- <h1 class="text-xl font-bold text-light-text-primary">Structures</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            <div class="grid grid-cols-2 gap-4">
                <ul class="list-disc pl-6 text-light-text-primary">
                {#each structures.slice(0, Math.ceil(structures.length / 2)) as structure}
                    <li class="py-1">{structure}</li>
                {/each}
                </ul>
                <ul class="list-disc pl-6 text-light-text-primary">
                {#each structures.slice(Math.ceil(structures.length / 2)) as structure}
                    <li class="py-1">{structure}</li>
                {/each}
                </ul>
            </div>
        </div>
        <div class="h-full w-1/2">
            <AddCoding />
        </div>
    </div> -->
</div>