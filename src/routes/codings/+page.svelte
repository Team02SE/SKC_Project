<script lang="ts">
	import TreeView from '$lib/components/TreeView/TreeView.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let codings = $state(data);
</script>

<sectiom class="h-full w-full flex-col">
	<TreeView label="Activities" rootNodes={codings.activities} />
	<TreeView label="Dsteps" rootNodes={codings.dsteps} />
	<TreeView label="Effects" rootNodes={codings.effects} />
	<TreeView label="Opportunity strucutres" rootNodes={codings.opportunityStructures} />
	<TreeView label="System vulnerabilities" rootNodes={codings.systemVulnerabilities} />
</sectiom>
