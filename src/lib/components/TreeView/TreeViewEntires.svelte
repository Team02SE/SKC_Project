<script lang="ts">
	import TreeView from '$lib/components/TreeView/TreeView.svelte';
	import type { Coding } from '$lib/types';
	import LeafNode from './LeafNode.svelte';
	import TreeViewEntry from './TreeViewEntires.svelte';

	interface Props {
		rootNodes: Coding[];
	}
	let { rootNodes }: Props = $props();

	let _expandedState = $state<boolean[]>([]);

	rootNodes.forEach((rootNode) => {
		_expandedState.push(rootNode.expanded);
	});

	console.log(rootNodes);
</script>

<div class="w-full flex-col items-start py-2">
	{#each rootNodes as node}
		<div class="ml-4">
			{#if node.children && node.children.length > 0}
				<button
					onclick={() => (node.expanded = !node.expanded)}
					class="w-full border-2 border-amber-950 p-2 text-start font-bold"
				>
					{node.name}
				</button>
				{#if node.expanded}
					{#each node.children as child}
						<TreeViewEntry rootNodes={[child]} />
					{/each}
				{/if}
			{:else}
				<LeafNode coding={node} />
			{/if}
		</div>
	{/each}
</div>
