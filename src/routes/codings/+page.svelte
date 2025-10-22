<script lang="ts">
	import TreeView from '$lib/components/TreeView/TreeView.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<sectiom class="h-full w-full flex-col">
	<TreeView label="Activities" rootNodes={data.activities} />
	<TreeView label="Dsteps" rootNodes={data.dsteps} />
	<TreeView label="Effects" rootNodes={data.effects} />
	<TreeView label="Opportunity strucutres" rootNodes={data.opportunityStructures} />
	<TreeView label="System vulnerabilities" rootNodes={data.systemVulnerabilities} />
</sectiom>
