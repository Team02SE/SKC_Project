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
		onCodingSelected: any;
		onAdd?: (parent: Coding, newNode: Coding) => void;
		onDelete?: (id: number) => void;
	}
	let { rootNodes, onCodingSelected, onAdd, onDelete }: Props = $props();

	let options = { duration: 200 };

	let openOptions = $state<string | null>(null);

	function toggleOptions(node: Coding) {
		const id = String(node.number);
		openOptions = openOptions === id ? null : id;
	}

	function removeById(nodes: Coding[], id: number): boolean {
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].id === id) {
				nodes.splice(i, 1);
				return true;
			}
			if (nodes[i].children && nodes[i].children.length) {
				if (removeById(nodes[i].children, id)) return true;
			}
		}
		return false;
	}

	async function addNode(parent: Coding) {
		openOptions = null;

		const tempId = -Date.now();
		const newNode: Coding = {
			id: tempId,
			name: '',
			number: 0,
			type: parent.type,
			description: '',
			category: parent.category,
			children: [],
			expanded: false
		};

		onAdd?.(parent, newNode);

		const res = await fetch(`/codings`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: newNode.name,
				number: newNode.number,
				description: newNode.description,
				parent_id: parent.id,
				type: parent.category
			})
		});

		if (!res.ok) {
			removeById(rootNodes, tempId);
			alert('Add failed');
			return;
		}

		const created = await res.json();
		newNode.id = created.id;
	}

	async function deleteNode(node: Coding) {
		openOptions = null;

		const res = await fetch(`/codings/${node.id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ type: node.category })
		});

		if (!res.ok) {
			alert("Delete failed");
			return;
		}

		onDelete?.(node.id);
	}
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
						<div class="relative mr-10">
							<button onclick={() => toggleOptions(node)} class="hover:scale-110">
								<img src={more} alt="more" class="h-10 w-10" />
							</button>
						
							{#if openOptions === String(node.number)}
								<div class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md z-50" transition:slide>
									<button class="block w-full text-left px-4 py-2 hover:bg-gray-100" onclick={() => addNode(node)}>
										Add
									</button>
									<button class="text-red-600 block w-full text-left px-4 py-2 hover:bg-gray-100" onclick={() => deleteNode(node)}>
										Delete
									</button>
								</div>
							{/if}
						</div>
				</div>
				{#if node.expanded}
					<div transition:slide={options}>
						{#each node.children as child}
								<TreeViewEntry
									{onCodingSelected}
									rootNodes={[child]}
									onAdd={onAdd}
									onDelete={onDelete}
								/>
						{/each}
					</div>
				{/if}
			{:else}
				<LeafNode
					{onCodingSelected}
					coding={node}
					onAdd={onAdd}
					onDelete={onDelete}
				/>
			{/if}
		</div>
	{/each}
</div>
