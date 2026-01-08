<script lang="ts">
	import type { Coding } from '$lib/types';
	import dropdown from '$lib/assets/dropdown.svg';
	import more from '$lib/assets/three-dots-circle.svg';
	import { slide } from 'svelte/transition';
	import DropdownList from '../DropdownList/DropdownList.svelte';
	import LeafNode from './LeafNode.svelte';
	import TreeViewEntry from './TreeViewEntires.svelte';
	import { toastStore } from '../PopUps/Toast/toastStore.svelte';
	import { dropdownState } from '$lib/utils/dropdownState.svelte';

	interface Props {
		rootNodes: Coding[];
		onCodingSelected: any;
		onCodingNodeAdded: any;
		onCodingDeleted: any;
	}
	let { rootNodes, onCodingSelected, onCodingNodeAdded, onCodingDeleted }: Props = $props();

	let options = { duration: 200 };

	function createMenuItems(node: Coding, dropdownId: string) {
		async function handleDelete() {
			const response = await fetch(`/codings/${node.id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ type: node.type })
			});

			let responseBody = await response.text();

			if (response.ok) {
				toastStore.success(`"${node.name}" deleted successfully`);
				onCodingDeleted(node);
			} else {
				console.error('Delete failed:', response.statusText);
				toastStore.error(responseBody);
			}
			dropdownState.close(dropdownId);
		}

		return [
			{
				label: 'Add',
				onClick: () => {
					onCodingNodeAdded(node.id ?? null);
					dropdownState.close(dropdownId);
				}
			},
			{ label: 'Delete', onClick: handleDelete, className: 'text-red-600' }
		];
	}
</script>

<div class="w-full flex-col items-start py-2">
	{#each rootNodes as node (node.id)}
		{@const dropdownId = `tree-${node.type}-${node.id}`}
		<div class="mt-2 ml-4">
			{#if node.children && node.children.length > 0}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div class="flex w-full items-center gap-1 rounded-2xl bg-white text-start shadow-md">
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
						<button
							class="duration-100 hover:scale-110"
							onclick={(e) => {
								e.stopPropagation();
								dropdownState.toggle(dropdownId);
							}}
						>
							<img src={more} alt="more" class="h-10 w-10" />
						</button>
						{#if dropdownState.isOpen(dropdownId)}
							<DropdownList
								menuItems={createMenuItems(node, dropdownId)}
								position="center"
								onClose={() => dropdownState.close(dropdownId)}
							/>
						{/if}
					</div>
				</div>
				{#if node.expanded}
					<div transition:slide={options}>
						{#each node.children as child (child.id)}
							<TreeViewEntry
								{onCodingSelected}
								rootNodes={[child]}
								{onCodingNodeAdded}
								{onCodingDeleted}
							/>
						{/each}
					</div>
				{/if}
			{:else}
				<LeafNode {onCodingSelected} {onCodingNodeAdded} {onCodingDeleted} coding={node} />
			{/if}
		</div>
	{/each}
</div>
