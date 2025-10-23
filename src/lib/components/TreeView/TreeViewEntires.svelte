<script lang="ts">
	import TreeView from '$lib/components/TreeView/TreeView.svelte';
	import type { Coding } from '$lib/types';
	import ButtonSvg from '../ButtonSvg.svelte';
	import LeafNode from './LeafNode.svelte';
	import TreeViewEntry from './TreeViewEntires.svelte';
	import dropdown from '$lib/assets/dropdown.svg';
	import more from '$lib/assets/three-dots-circle.svg';
	import { slide } from 'svelte/transition';

	interface Props {
		rootNodes: Coding[];
	}
	let { rootNodes }: Props = $props();

	let _expandedState = $state<boolean[]>([]);

	rootNodes.forEach((rootNode) => {
		_expandedState.push(rootNode.expanded);
	});

	console.log(rootNodes);

	let options = { duration: 200 };
</script>

<div class="w-full flex-col items-start py-2">
	{#each rootNodes as node}
		<div class="mt-2 ml-4">
			{#if node.children && node.children.length > 0}
				<div
					class="flex w-full items-center gap-1 rounded-2xl border-1 border-black bg-white text-start font-bold"
				>
					<button>
						<img
							onclick={() => (node.expanded = !node.expanded)}
							class="{node.expanded
								? ''
								: 'rotate-180'} hover: h-16 w-16 opacity-45 duration-100 hover:opacity-70"
							src={dropdown}
							alt="tree-view-expansion"
						/>
					</button>
					<h2 class="text-2xl font-normal">{node.name}</h2>
					<div class="ml-10 flex-3 flex-col gap-0 text-xs font-normal opacity-55">
						<p class="m-0 leading-tight">Last edited:</p>
						<p class="m-0 leading-tight">Description:</p>
					</div>
					<span class="mr-10 duration-100 hover:scale-110">
						<img src={more} alt="more" class="h-10 w-10" />
					</span>
				</div>
				{#if node.expanded}
					<div transition:slide={options}>
						{#each node.children as child}
							<TreeViewEntry rootNodes={[child]} />
						{/each}
					</div>
				{/if}
			{:else}
				<LeafNode coding={node} />
			{/if}
		</div>
	{/each}
</div>
