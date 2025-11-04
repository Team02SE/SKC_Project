<script lang="ts">
	import type { Coding } from '$lib/types';
	import more from '$lib/assets/three-dots-circle.svg';
	import { slide } from 'svelte/transition';
	import type { API_URL, API_KEY } from '$env/static/private';

	interface Props {
		coding: Coding;
		onCodingSelected: any;
		onAdd?: (parent: Coding, newNode: Coding) => void;
		onDelete?: (id: number) => void;
	}
	let { coding, onCodingSelected, onAdd, onDelete }: Props = $props();

	let openOptions = $state<string | null>(null);

	function toggleOptions(node: Coding) {
		const id = String(node.number);
		openOptions = openOptions === id ? null : id;
	}

	async function addNode(node: Coding) {
		openOptions = null;

		const body = {
			name: "",
			number: 0,
			description: "",
			parent_id: node.id,
			type: node.category
		};

		const res = await fetch(`/codings`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		});

		if (!res.ok) {
			alert("Add failed");
			return;
		}

		const created: Coding = await res.json();

		onAdd?.(node, {
			...created,
			category: node.category,
			children: []
		});
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

<div
	class="flex w-full flex-row items-center gap-1 rounded-2xl bg-white text-start font-bold shadow-md"
>
	<div class="ml-4 w-full flex-col items-start p-1">
		<button
			class="flex w-full flex-col items-start"
			onclick={() => {
				onCodingSelected(coding);
			}}
		>
			<h2 class="text-2xl font-normal"><b>{coding.number}</b> {coding.name}</h2>
			<div class="flex-3 flex-col gap-0 text-xs font-normal opacity-55">
				<p class="m-0 leading-tight">Last edited:</p>
				<p class="m-0 leading-tight">Description:</p>
			</div>
		</button>
	</div>
		<div class="relative mr-10">
			<button onclick={() => toggleOptions(coding)} class="hover:scale-110">
				<img src={more} alt="more" class="h-10 w-10" />
			</button>
		
			{#if openOptions === String(coding.number)}
				<div class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md z-50" transition:slide>
					<button class="block w-full text-left px-4 py-2 hover:bg-gray-100" onclick={() => addNode(coding)}>
						Add
					</button>
					<button class="text-red-600 block w-full text-left px-4 py-2 hover:bg-gray-100" onclick={() => deleteNode(coding)}>
						Delete
					</button>
				</div>
			{/if}
		</div>
</div>
