<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";
    import AddSubCoding from "./AddSubCoding.svelte";
    import type { Effect } from "$lib/types";
    import { codingToCodingData, getAllCodingIds, createSubCodingHandler } from '$lib';

	interface Props {
        data: Effect[];
        availableCodings?: Effect[];
        documentId?: number;
        onCodingAdded?: (coding: Effect) => void;
    }

    let { data: initialData, availableCodings = initialData, documentId, onCodingAdded }: Props = $props();
    
    let data = $state(initialData);

    let n1Effects = $derived(data.filter(effect => !effect.parent_id));
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

    const handleSubCodingAdded = createSubCodingHandler<Effect>(
        () => data,
        (newData) => data = newData,
        () => addSubCodingParentId,
        onCodingAdded,
        handleCloseAddSub
    );
</script>

<div class="mb-50 relative">
    <h1 class="text-4xl font-bold text-light-text-primary">Effects</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">N1</h2>
            {#each n1Effects as effect}
                <TreeCodings 
                    data={codingToCodingData(effect)} 
                    type='effects'
                    codingId={effect.id}
                    onAddSubRequest={handleAddSubRequest}
                />
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

    {#if showAddSubCoding}
        <AddSubCoding 
            type="effects" 
            parentId={addSubCodingParentId}
            availableCodings={availableChildCodings}
            documentId={documentId}
            excludeCodingIds={existingCodingIds}
            onClose={handleCloseAddSub}
            onCodingAdded={handleSubCodingAdded}
        />
    {/if}
</div>
