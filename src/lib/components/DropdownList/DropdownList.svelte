<script lang="ts">
	import type { Coding } from "$lib/types";


    interface Props {
		rootNode: Coding;
		onCodingNodeAdded: any;
	}
	let { rootNode, onCodingNodeAdded }: Props = $props();
</script>

<div class="flex flex-col p-4 bg-white">
	<button class="" onclick={() => onCodingNodeAdded(rootNode.id)}> Add </button>

	<button class=""> Delete </button>
</div>
