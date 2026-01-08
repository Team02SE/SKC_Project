<script lang="ts">
	import { fade } from 'svelte/transition';
	import DocumentEditField from './DocumentEditField.svelte';
	import type { WorkflowDocument } from '$lib/types';
	import { toastStore } from '../PopUps/Toast/toastStore.svelte';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		allowEdit: Boolean;
		workflowDocument: WorkflowDocument;
	}

	async function OnDocumentSave() {
		try {
			const response = await fetch(`/api/documents/${workflowDocument.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...workflowDocument })
			});

			if (!response.ok) {
				console.error('Update failed:', response.statusText);
				toastStore.error('Failed to update document');
				return;
			}

			toastStore.success(`"${workflowDocument.Title}" updated successfully`);

			await invalidateAll();
		} catch (error) {
			console.error('Error deleting document:', error);
			toastStore.error('An error occurred while deleting the document');
		}
	}

	let { allowEdit, workflowDocument }: Props = $props();
</script>

<section class="flex h-full w-full flex-col gap-6 text-light-text-primary">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<DocumentEditField
			onSave={OnDocumentSave}
			{allowEdit}
			label="Title"
			bind:val={workflowDocument.Title}
		/>
		<DocumentEditField
			onSave={OnDocumentSave}
			{allowEdit}
			label="File name"
			bind:val={workflowDocument.FileName}
		/>
	</div>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<DocumentEditField
			onSave={OnDocumentSave}
			{allowEdit}
			label="Organisation"
			bind:val={workflowDocument.Source}
		/>
		<DocumentEditField
			onSave={OnDocumentSave}
			{allowEdit}
			label="Language"
			bind:val={workflowDocument.Language}
		/>
	</div>

	<DocumentEditField
		onSave={OnDocumentSave}
		{allowEdit}
		label="Summary"
		bind:val={workflowDocument.Summary}
	/>

	<DocumentEditField
		onSave={OnDocumentSave}
		{allowEdit}
		label="Essence"
		bind:val={workflowDocument.Essence}
	/>
</section>
