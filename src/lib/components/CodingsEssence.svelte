<script lang="ts">
	import { Interface } from 'readline';
	import Textbox from './Textbox.svelte';
	import type { WorkflowDocument } from '$lib/types';

	interface Props {
		workflowDocument: WorkflowDocument;
	}

	let { workflowDocument }: Props = $props();
</script>

<section id="essence" class="mb-50">
	<h1 class="text-4xl font-bold text-light-text-primary">Essence</h1>
	<Textbox title="Essence" content={workflowDocument.Essence} />
	<Textbox title="Summary" content={workflowDocument.Conclusion} />
	<Textbox
		title="Conclusion"
		content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada ex at purus tincidunt, eu consequat augue ultrices. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin sed lobortis ex, sed accumsan est."
	/>
</section>
