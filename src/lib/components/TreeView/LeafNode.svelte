<script lang="ts">
	import type { Coding } from '$lib/types';
	import more from '$lib/assets/three-dots-circle.svg';

	interface Props {
		coding: Coding;
	}
	let { coding }: Props = $props();
</script>

<div
	class="flex w-full items-center gap-1 rounded-2xl border-1 border-black bg-white text-start font-bold"
>
	<div class="ml-4 w-full flex-col items-start p-1">
		<h2 class="text-2xl font-normal">{coding.name}</h2>
		<div class="flex-3 flex-col gap-0 text-xs font-normal opacity-55">
			<p class="m-0 leading-tight">Last edited:</p>
			<p class="m-0 leading-tight">Description:</p>
		</div>
	</div>
	<span class="mr-10 duration-100 hover:scale-110">
		<img src={more} alt="more" class="h-10 w-10" />
	</span>
</div>
