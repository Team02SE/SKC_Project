<script lang="ts">
    import TreeCodings from './TreeCodings.svelte';
	import AddCoding from './AddCoding.svelte';
	import AddSubCoding from './AddSubCoding.svelte';
	import type { DStep } from "$lib/types";
	import { codingToCodingData, getAllCodingIds } from '$lib';

	interface Props {
		data: DStep[];
		availableCodings?: DStep[];
		documentId?: number;
		onCodingAdded?: (coding: DStep) => void;
	}

	let { data, availableCodings = data, documentId, onCodingAdded }: Props = $props();

    let n1Dstep = $derived(data.filter(dstep => !dstep.parent_id));
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

    function handleSubCodingAdded(coding: DStep) {
        if (onCodingAdded) {
            const parentId = addSubCodingParentId;
            if (parentId) {
                const newSubCoding: DStep = {
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
    <h1 class="text-4xl font-bold text-light-text-primary">DESTEP</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            {#each n1Dstep as dstep}
                <TreeCodings 
                    data={codingToCodingData(dstep)} 
                    type='dsteps'
                    codingId={dstep.id}
                    onAddSubRequest={handleAddSubRequest}
                />
            {/each}
        </div>
		<div class="h-full w-1/2">
            <AddCoding 
                type='dsteps'
                availableCodings={availableCodings}
                documentId={documentId}
                excludeCodingIds={existingCodingIds}
                onCodingAdded={onCodingAdded}
            />
        </div>
    </div>

    {#if showAddSubCoding}
        <AddSubCoding 
            type="dsteps" 
            parentId={addSubCodingParentId}
            availableCodings={availableChildCodings}
            documentId={documentId}
            excludeCodingIds={existingCodingIds}
            onClose={handleCloseAddSub}
            onCodingAdded={handleSubCodingAdded}
        />
    {/if}
        
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

