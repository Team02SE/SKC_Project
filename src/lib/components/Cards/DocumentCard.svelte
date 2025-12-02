<script lang="ts">
	import ButtonSvg from '../Buttons/ButtonSvg.svelte';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import type { WorkflowDocument } from '$lib/types';
	import PopUp from '../PopUps/PopUp.svelte';
	import { toastStore } from '../PopUps/Toast/toastStore.svelte';

	interface Props {
		roundedTop: boolean;
		workflowDocument: WorkflowDocument;
		onDocumentDeleted?: (doc: WorkflowDocument) => void;
	}

	let { roundedTop = false, workflowDocument, onDocumentDeleted }: Props = $props();

	let popUpOpen = $state(false);

	function handleDeleteClick() {
		popUpOpen = true;
	}

	async function handleDelete() {
		popUpOpen = false;

		try {
			const response = await fetch(`/api/documents/${workflowDocument.id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!response.ok) {
				console.error('Delete failed:', response.statusText);
				toastStore.error('Failed to delete document');
				return;
			}

			toastStore.success(`"${workflowDocument.Title}" deleted successfully`);

			if (onDocumentDeleted) {
				onDocumentDeleted(workflowDocument);
			}

			await invalidateAll();
		} catch (error) {
			console.error('Error deleting document:', error);
			toastStore.error('An error occurred while deleting the document');
		}
	}

	function handleEdit() {
		goto(`/workflows/` + workflowDocument.id);
	}

	function IntToStatusColour(doc_status: number): string {
		if (doc_status === 0) return 'bg-red-500'; // Not started
		if (doc_status === 1) return 'bg-orange-500'; // In progress
		if (doc_status === 2) return 'bg-green-500'; // Finished
		return 'bg-black'; // Fallback
	}

	function IntToStatusString(doc_status: number): string {
		if (doc_status === 0) {
			return 'Not started';
		} // Not started - red
		if (doc_status === 1) {
			return 'In progress';
		} // In progress - orange
		if (doc_status === 2) {
			return 'Finished ';
		} // Finished - green
		return 'Unknown'; // Fallback - black
	}
</script>

{#if popUpOpen}
	<div class="rounded-4xl p-5">
		<PopUp
			heading="Delete Document"
			question="Are you sure you want to delete '{workflowDocument.Title}'? This action cannot be undone."
			onClose={() => (popUpOpen = false)}
			onYes={handleDelete}
		/>
	</div>
{/if}

<div
	class={`flex w-full flex-col gap-4 bg-light-primary p-5 inset-shadow-sm/25 sm:flex-row sm:items-end sm:justify-between ${roundedTop ? 'rounded-t-2xl' : ''}`}
>
	<div class="flex flex-col items-start">
		<div class="flex items-center">
			<h2 class="text-xl font-semibold sm:text-2xl md:text-3xl">{workflowDocument.Title}</h2>
			<div class="{IntToStatusColour(workflowDocument.Status)} ml-4 rounded-full p-1"></div>
		</div>
		<div class="flex flex-row items-center">
			<p class="text-sm sm:text-base">Status: {IntToStatusString(workflowDocument.Status)}</p>
		</div>
		<p class="text-sm sm:text-base">Last modified: {workflowDocument.UpdatedAt}</p>
	</div>

	<div class="flex shrink-0 flex-row gap-4 [@media(min-width:1100px)]:flex-col [@media(min-width:1500px)]:flex-row">
		<ButtonSvg type="eye" size={8} />
		<ButtonSvg type="edit" size={8} onClick={handleEdit} />
		<ButtonSvg type="trash" size={8} onClick={handleDeleteClick} />
	</div>
</div>