<script lang="ts">
	import { fade } from 'svelte/transition';
	import DocumentEditField from './DocumentEditField.svelte';
	import type { WorkflowDocument } from '$lib/types';

	interface Props {
		allowEdit: Boolean;
		workflowDocument: WorkflowDocument;
	}

	const { allowEdit, workflowDocument }: Props = $props();
</script>

<section class="flex h-full w-full flex-col gap-6 text-light-text-primary">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<DocumentEditField {allowEdit} label="Title" value={workflowDocument.Title} />
		<DocumentEditField {allowEdit} label="File name" value={workflowDocument.FileName} />
	</div>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<DocumentEditField {allowEdit} label="Organisation" value={workflowDocument.Source} />
		<DocumentEditField {allowEdit} label="Language" value={workflowDocument.Language} />
	</div>

	<div class="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-inner shadow-gray-200">
		<DocumentEditField {allowEdit} label="Summary" value={workflowDocument.Conclusion} />
	</div>

	<div class="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-inner shadow-gray-200">
		<DocumentEditField {allowEdit} label="Essence" value={workflowDocument.Essence} />
	</div>
</section>
