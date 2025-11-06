<script lang="ts">
	import type { Coding } from '$lib/types';
	import TreeViewEntires from './TreeViewEntires.svelte';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		rootNodes: Coding[];
		label: String;
		onCodingSelected: any;
	}
	let { rootNodes, label, onCodingSelected }: Props = $props();

	function insertChild(nodes: Coding[], parent: Coding, newNode: Coding): boolean {
		for (const node of nodes) {
			if (node.id === parent.id) {
				node.children ||= [];
				node.children.push(newNode);
				node.expanded = true;
				return true;
			}
			
			if (node.children && insertChild(node.children, parent, newNode)) {
				return true;
			}
		}
		return false;
	}

	function removeNode(nodes: Coding[], id: number): boolean {
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].id === id) {
				nodes.splice(i, 1);
				return true;
			}

			if (nodes[i].children && removeNode(nodes[i].children, id)) {
				return true;
			}
		}
		return false;
	}
</script>

<div class="flex h-full w-full flex-col overflow-auto">
	<div class="ml-4 text-4xl">
		{label}
	</div>
	<div class="flex h-[40rem] w-full flex-col overflow-y-scroll">
		<TreeViewEntires 
			{onCodingSelected} 
			{rootNodes}
			
			onAdd={(parent,newNode) => {
				insertChild(rootNodes, parent, newNode);
				rootNodes = [...rootNodes];
			}}

			onDelete={(id) => {
				removeNode(rootNodes, id);
				rootNodes = [...rootNodes];
			}}
		/>
	</div>
</div>
