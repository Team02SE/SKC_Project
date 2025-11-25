<script lang="ts">
	import type { Coding } from '$lib/types';
	import dropdown from '$lib/assets/dropdown.svg';
	import more from '$lib/assets/three-dots-circle.svg';
	import { slide } from 'svelte/transition';
	import DropdownList from '../DropdownList/DropdownList.svelte';
	import LeafNode from './LeafNode.svelte';
	import TreeViewEntry from './TreeViewEntires.svelte';

	interface Props {
		rootNodes: Coding[];
		onCodingSelected: any;
		onCodingNodeAdded: any;
	}
	let { rootNodes, onCodingSelected, onCodingNodeAdded }: Props = $props();

	let options = { duration: 200 };

</script>

<div class="w-full flex-col items-start py-2">
	{#each rootNodes as node (node.id)}
		<div class="mt-2 ml-4">
			{#if node.children && node.children.length > 0}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="flex w-full items-center gap-1 rounded-2xl bg-white text-start font-bold shadow-md"
				>
					<button
						type="button"
						onclick={() => (node.expanded = !node.expanded)}
						aria-expanded={node.expanded}
						class="border-0 bg-transparent p-0"
					>
						<img
							class="h-16 w-16 opacity-45 duration-400 hover:opacity-70"
							class:rotate-180={!node.expanded}
							src={dropdown}
							alt="tree-view-expansion"
						/>
					</button>
					<div class="flex w-full flex-row items-center" onclick={() => onCodingSelected(node)}>
						<h2 class="text-2xl font-normal"><b>{node.number}</b> {node.name}</h2>
						<div class="ml-10 flex-3 flex-col gap-0 text-xs font-normal opacity-55">
							<p class="m-0 leading-tight">Last edited:</p>
							<p class="m-0 leading-tight">Description:</p>
						</div>
					</div>
					<div class="relative inline-block">
						<button class="mr-10 duration-100 hover:scale-110" onclick={(e) => { e.stopPropagation(); node.isOptionsOpen = !node.isOptionsOpen; }}>
							<img src={more} alt="more" class="h-10 w-10" />
						</button>
						{#if node.isOptionsOpen}
							<DropdownList 
								rootNode={node}
								onCodingNodeAdded={onCodingNodeAdded}
							/>
						{/if}
					</div>
				</div>
				{#if node.expanded}
					<div transition:slide={options}>
						{#each node.children as child (child.id)}
							<TreeViewEntry {onCodingSelected} rootNodes={[child]} onCodingNodeAdded={onCodingNodeAdded} />
						{/each}
					</div>
				{/if}
			{:else}
				<LeafNode {onCodingSelected} {onCodingNodeAdded} coding={node} />
			{/if}
		</div>
	{/each}
</div>
