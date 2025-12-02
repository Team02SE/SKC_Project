<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Tab {
		id: string;
		label: string;
	}

	let activeTab: string = $state('activities');

	let { onTabChange } = $props();

	const tabs: Tab[] = [
		{ id: 'activities', label: 'Activities' },
		{ id: 'effects', label: 'Effects' },
		{ id: 'opportunity-structures', label: 'Opportunity Structures' },
		{ id: 'system-vulnerabilities', label: 'System Vulnerabilities' },
		{ id: 'dsteps', label: 'Dsteps' }
	];

	function selectTab(tabId: string) {
		activeTab = tabId;
		onTabChange(tabId);
	}
</script>

<div class="flex gap-1">
	{#each tabs as tab}
		<button
			onclick={() => selectTab(tab.id)}
			class="p-2 rounded-lg text-lg font-medium transition-colors hover:cursor-pointer
                {activeTab === tab.id
				? 'border-b-2 border-blue-500 bg-blue-100 text-blue-700'
				: 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}"
		>
			{tab.label}
		</button>
	{/each}
</div>
