<script lang="ts">
	import type { Coding } from '$lib/types';
	import TreeViewEntires from './TreeViewEntires.svelte';

	interface Props {
		rootNodes: Coding[];
		label: String;
	}
	let { rootNodes, label }: Props = $props();
</script>

<div class="text-2xl">
	{label}
</div>

<div class="h-full w-full overflow-auto">
	<TreeViewEntires {rootNodes} />
</div>
