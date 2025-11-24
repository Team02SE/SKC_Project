<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";
    import AddSubCoding from "./AddSubCoding.svelte";
	import Textbox from "./Textbox.svelte";
    import type { SystemVulnerability } from "$lib/types";
    import { codingToCodingData, getAllCodingIds, createSubCodingHandler } from '$lib';

	interface Props {
        data: SystemVulnerability[];
        availableCodings?: SystemVulnerability[];
        documentId?: number;
        onCodingAdded?: (coding: SystemVulnerability) => void;
    }

    let { data: initialData, availableCodings = initialData, documentId, onCodingAdded }: Props = $props();
    
    let data = $state(initialData);

    let topLevelVulnerabilities = $derived(data.filter(item => !item.parent_id));
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

    const handleSubCodingAdded = createSubCodingHandler<SystemVulnerability>(
        () => data,
        (newData) => data = newData,
        () => addSubCodingParentId,
        onCodingAdded,
        handleCloseAddSub
    );
</script>

<div class="mb-50 relative">
    <h1 class="text-4xl font-bold text-light-text-primary">System Vulnerabilities - Clustering</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            {#each topLevelVulnerabilities as vulnerability}
            <TreeCodings 
                data={codingToCodingData(vulnerability)} 
                type='system-vulnerabilities'
                codingId={vulnerability.id}
                onAddSubRequest={handleAddSubRequest}
            />
            {/each}
        </div>

		<div class="h-full w-1/2">
            <AddCoding 
                type="system-vulnerabilities"
                availableCodings={availableCodings}
                documentId={documentId}
                excludeCodingIds={existingCodingIds}
                onCodingAdded={onCodingAdded}
            />
        </div>
    </div>

    {#if showAddSubCoding}
        <AddSubCoding 
            type="system-vulnerabilities" 
            parentId={addSubCodingParentId}
            availableCodings={availableChildCodings}
            documentId={documentId}
            excludeCodingIds={existingCodingIds}
            onClose={handleCloseAddSub}
            onCodingAdded={handleSubCodingAdded}
        />
    {/if}

    <!-- <h1 class="text-4xl font-bold text-light-text-primary">System Vulnerabilities</h1>
    <Textbox /> -->
</div>