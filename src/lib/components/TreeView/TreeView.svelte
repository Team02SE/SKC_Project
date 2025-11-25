<script lang="ts">
	import type { Coding } from '$lib/types';
	import TreeViewEntires from './TreeViewEntires.svelte';

	interface Props {
		rootNodes: Coding[];
		label: String;
		onCodingSelected: any;
		onCodingNodeAdded: any;
	}
	let { rootNodes, label, onCodingSelected, onCodingNodeAdded }: Props = $props();
</script>

<div class="flex h-full w-full flex-col overflow-auto">
	<div class="ml-4 text-4xl">
		{label}
	</div>
	<div class="flex h-[40rem] w-full flex-col overflow-y-scroll">
		<TreeViewEntires {onCodingSelected} {rootNodes} {onCodingNodeAdded}/>
	</div>
</div>
