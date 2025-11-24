<script lang="ts">
	import AddCoding from "./AddCoding.svelte";
	import type { Activity } from '$lib/types';

    export let type: 'activities' | 'effects' | 'opportunity-structures' | 'system-vulnerabilities' | 'dsteps';
    export let parentId: number | null = null;
    export let availableCodings: Activity[] = [];
    export let documentId: number | undefined = undefined;
    export let onClose: (() => void) | undefined = undefined;
</script>

<div class="bg-white rounded-2xl">
    <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-light-text-primary">Add sub-{type}</h3>
        {#if onClose}
            <button 
                class="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                onclick={onClose}
            >
                ×
            </button>
        {/if}
    </div>
    <AddCoding 
        type={type} 
        availableCodings={availableCodings}
        documentId={documentId}
        parentId={parentId}
    />
</div>