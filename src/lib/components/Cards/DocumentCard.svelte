<script lang="ts">
	import ButtonSvg from '../Buttons/ButtonSvg.svelte';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import type { WorkflowDocument } from '$lib/types';
	import PopUp from '../PopUps/PopUp.svelte';
	import { toastStore } from '../PopUps/Toast/toastStore.svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		roundedTop: boolean;
		workflowDocument: WorkflowDocument;
		onDocumentDeleted?: (doc: WorkflowDocument) => void;
		onDocumentClick: (doc: WorkflowDocument) => void;
	}

	let {
		roundedTop = false,
		workflowDocument,
		onDocumentDeleted,
		onDocumentClick
	}: Props = $props();

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

	const statusConfig = {
		0: { color: 'bg-red-500', label: 'Not started' },
		1: { color: 'bg-orange-500', label: 'In progress' },
		2: { color: 'bg-green-500', label: 'Finished' }
	} as const;

	function getStatusConfig(status: number) {
		return (
			statusConfig[status as keyof typeof statusConfig] || { color: 'bg-black', label: 'Unknown' }
		);
	}

	function formatDate(dateString: string): string {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return dateString;
		}
	}

	function handleOnDocumentClick() {
		onDocumentClick(workflowDocument);
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

<button
	onclick={handleOnDocumentClick}
	class={`flex w-full flex-col gap-4 bg-light-primary p-5 inset-shadow-sm/25 sm:flex-row sm:items-end sm:justify-between ${roundedTop ? 'rounded-t-2xl' : ''}`}
>
	<div class="flex flex-col items-start">
		<div class="flex items-center">
			<h2 class="text-xl font-semibold sm:text-2xl md:text-3xl">{workflowDocument.Title}</h2>
			<div class="{getStatusConfig(workflowDocument.Status).color} ml-4 rounded-full p-1"></div>
		</div>
		<div class="flex flex-row items-center">
			<p class="text-sm sm:text-base">Status: {getStatusConfig(workflowDocument.Status).label}</p>
		</div>
		<p class="text-sm sm:text-base">Last modified: {formatDate(workflowDocument.UpdatedAt)}</p>
	</div>

	<div
		class="flex shrink-0 flex-row gap-4 [@media(min-width:1100px)]:flex-col [@media(min-width:1500px)]:flex-row"
	>
		<!-- <ButtonSvg type="eye" size={8} /> -->
		<ButtonSvg type="edit" size={8} onClick={handleEdit} />
		<ButtonSvg type="trash" size={8} onClick={handleDeleteClick} />
	</div>
</button>
