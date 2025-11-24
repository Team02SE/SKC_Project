<script lang="ts">
	import AddCoding from "./AddCoding.svelte";
	import type { Activity, Coding } from '$lib/types';

    export let type: 'activities' | 'effects' | 'opportunity-structures' | 'system-vulnerabilities' | 'dsteps';
    export let parentId: number | null = null;
    export let availableCodings: Activity[] = [];
    export let documentId: number | undefined = undefined;
    export let excludeCodingIds: Set<number> | undefined = undefined;
    export let onClose: (() => void) | undefined = undefined;
    export let onCodingAdded: ((coding: Coding) => void) | undefined = undefined;

    function handleOverlayKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && onClose) {
            onClose();
        }
    }

    function handleModalKeydown(e: KeyboardEvent) {
        e.stopPropagation();
    }
</script>

<div 
    class="absolute inset-0 bg-black/20 z-30 flex items-center justify-center" 
    role="button"
    tabindex="0"
    onclick={onClose}
    onkeydown={handleOverlayKeydown}
>
    <div 
        class="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full" 
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        onclick={(e) => e.stopPropagation()}
        onkeydown={handleModalKeydown}
    >
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-light-text-primary">Add sub-{type}</h3>
            {#if onClose}
                <button 
                    class="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    onclick={onClose}
                    aria-label="Close"
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
            excludeCodingIds={excludeCodingIds}
            onCodingAdded={onCodingAdded}
        />
    </div>
</div>