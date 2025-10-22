<script lang="ts">
	import type { Coding } from '$lib/types';

	interface Props {
		coding: Coding;
	}
	let { coding }: Props = $props();
</script>

<p class="w-full border-2 p-2">{coding.name}</p>
