<script lang="ts">
	import type { Coding } from '$lib/types';
	import TreeViewEntires from './TreeViewEntires.svelte';
	import ButtonText from '../Buttons/ButtonText.svelte';

	interface Props {
		rootNodes: Coding[];
		label: String;
		onCodingSelected: any;
		onCodingNodeAdded: any;
		onCodingDeleted: any;
	}
	let { rootNodes, label, onCodingSelected, onCodingNodeAdded, onCodingDeleted }: Props = $props();

	function handleAddRootCoding() {
		onCodingNodeAdded(null);
	}
</script>

<div class="flex h-full w-full flex-col overflow-auto">
	<div class="ml-4 flex items-center justify-between pr-4">
		<div class="text-4xl">
			{label}
		</div>
		<button type="button" onclick={handleAddRootCoding}>
			<ButtonText text="Add" />
		</button>
	</div>
	<div class="flex h-[40rem] w-full flex-col overflow-y-scroll">
		<TreeViewEntires {onCodingSelected} {rootNodes} {onCodingNodeAdded} {onCodingDeleted}/>
	</div>
</div>
