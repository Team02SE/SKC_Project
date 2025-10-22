<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	console.log(data)

</script>




<sectiom class="flex w-full h-full">
	<div>
		{#each data.effects as coding }
			<p class="p-2 bg-red-200">{coding.name}</p>
		{/each}
	</div>
</sectiom>	