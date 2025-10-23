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
	<TreeViewEntires {onCodingSelected} {rootNodes} />
</div>
