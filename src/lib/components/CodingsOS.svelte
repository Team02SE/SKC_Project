<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";
    import AddSubCoding from "./AddSubCoding.svelte";
    import type { OpportunityStructure } from "$lib/types";
    import { codingToCodingData, getAllCodingIds } from '$lib';

	interface Props {
        data: OpportunityStructure[];
        availableCodings?: OpportunityStructure[];
        documentId?: number;
        onCodingAdded?: (coding: OpportunityStructure) => void;
    }

    let { data, availableCodings = data, documentId, onCodingAdded }: Props = $props();

    let sectors = $derived(data.filter(item => !item.parent_id));
    let existingCodingIds = $derived(getAllCodingIds(data));

    let showAddSubCoding = $state(false);
    let addSubCodingParentId = $state<number | null>(null);

    let availableChildCodings = $derived.by(() => {
        if (!addSubCodingParentId || !availableCodings) return [];
        
        const parentCoding = availableCodings.find(c => c.id === addSubCodingParentId);
        return parentCoding?.children || [];
    });

    function handleAddSubRequest(parentId: number) {
        addSubCodingParentId = parentId;
        showAddSubCoding = true;
    }

    function handleCloseAddSub() {
        showAddSubCoding = false;
        addSubCodingParentId = null;
    }

    function handleSubCodingAdded(coding: OpportunityStructure) {
        if (onCodingAdded) {
            const parentId = addSubCodingParentId;
            if (parentId) {
                const newSubCoding: OpportunityStructure = {
                    ...coding,
                    parent_id: parentId,
                    isNew: true,
                    children: null
                };
                onCodingAdded(newSubCoding);
            }
        }
        handleCloseAddSub();
    }
    </script>

<div class="mb-50 relative">
    <h1 class="text-4xl font-bold text-light-text-primary">Opportunity Structures</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            {#each sectors as sector}
            <TreeCodings 
                data={codingToCodingData(sector)} 
                type='opportunity-structures'
                codingId={sector.id}
                onAddSubRequest={handleAddSubRequest}
            />
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

    {#if showAddSubCoding}
        <AddSubCoding 
            type="opportunity-structures" 
            parentId={addSubCodingParentId}
            availableCodings={availableChildCodings}
            documentId={documentId}
            excludeCodingIds={existingCodingIds}
            onClose={handleCloseAddSub}
            onCodingAdded={handleSubCodingAdded}
        />
    {/if}

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