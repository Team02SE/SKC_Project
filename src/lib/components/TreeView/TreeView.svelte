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
</script>

<div class="flex h-full w-full flex-col overflow-auto">
	<div class="ml-4 text-4xl">
		{label}
	</div>
	<div class="flex h-[40rem] w-full flex-col overflow-y-scroll">
		<TreeViewEntires 
			{onCodingSelected} 
			{rootNodes}
			onAdd={(parent, newNode) => {
				function insert(nodes: Coding[]): boolean {
					for (const n of nodes) {
						if (n.id === parent.id) {
							n.children ||= [];
							n.children.push(newNode);
							n.expanded = true;
							return true;
						}
						if (n.children && insert(n.children)) return true;
					}
					return false;
				}
			
				insert(rootNodes);
			}}
			
			onDelete={(id) => {
				function remove(nodes: Coding[]): boolean {
					for (let i = 0; i < nodes.length; i++) {
						if (nodes[i].id === id) {
							nodes.splice(i, 1);
							return true;
						}
					
						// recurse into children
						if (nodes[i].children && nodes[i].children.length > 0) {
							const deleted = remove(nodes[i].children);
							if (deleted) {
								if (nodes[i].children.length === 0) {
									nodes[i].children = [];
								}
								return true;
							}
						}
					}
					return false;
				}
			
				remove(rootNodes);
			}}
		/>
	</div>
</div>
