<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    interface Tab {
        id: string;
        label: string;
    }

    export let activeTab: string = 'activities';

    const dispatch = createEventDispatcher();

    const tabs: Tab[] = [
        { id: 'activities', label: 'Activities' },
        { id: 'effects', label: 'Effects' },
        { id: 'opportunity-structures', label: 'Opportunity Structures' },
        { id: 'system-vulnerabilities', label: 'System Vulnerabilities' },
        { id: 'dsteps', label: 'Dsteps' }
    ];

    function selectTab(tabId: string) {
        activeTab = tabId;
        dispatch('tabChange', { tab: tabId });
    }
</script>

<div class="flex gap-1 mb-6">
    {#each tabs as tab}
        <button
            on:click={() => selectTab(tab.id)}
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors
                {activeTab === tab.id 
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}"
        >
            {tab.label}
        </button>
    {/each}
</div>
