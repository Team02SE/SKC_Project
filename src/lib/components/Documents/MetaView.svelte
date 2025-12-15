<script lang="ts">
	import { fade } from 'svelte/transition';
	import DocumentEditField from './DocumentEditField.svelte';
	import type { WorkflowDocument } from '$lib/types';

	interface Props {
		allowEdit: Boolean;
		workflowDocument: WorkflowDocument;
	}

	function OnDocumentSave() {
		console.log(workflowDocument);
	}

	const { allowEdit, workflowDocument }: Props = $props();
</script>

<section class="flex h-full w-full flex-col gap-6 text-light-text-primary">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<DocumentEditField
			onSave={OnDocumentSave}
			{allowEdit}
			label="Title"
			val={workflowDocument.Title}
		/>
		<DocumentEditField
			onSave={OnDocumentSave}
			{allowEdit}
			label="File name"
			val={workflowDocument.FileName}
		/>
	</div>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<DocumentEditField
			onSave={OnDocumentSave}
			{allowEdit}
			label="Organisation"
			val={workflowDocument.Source}
		/>
		<DocumentEditField
			onSave={OnDocumentSave}
			{allowEdit}
			label="Language"
			val={workflowDocument.Language}
		/>
	</div>

	<DocumentEditField
		onSave={OnDocumentSave}
		{allowEdit}
		label="Summary"
		val={workflowDocument.Conclusion}
	/>

	<DocumentEditField
		onSave={OnDocumentSave}
		{allowEdit}
		label="Essence"
		val={workflowDocument.Essence}
	/>
</section>
