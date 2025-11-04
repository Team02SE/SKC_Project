<script lang="ts">
	import ButtonSvg from './ButtonSvg.svelte';
	import { goto } from '$app/navigation';
	import type { WorkflowDocument } from '$lib/types';

	interface Props {
		roundedTop: boolean;
		workflowDocument: WorkflowDocument;
	}

	let { roundedTop = false, workflowDocument }: Props = $props();

	function handleDelete() {
		console.error('not implemented');
	}

	function handleEdit() {
		goto(`/workflows/` + id);
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

<div
	class={`flex w-full items-end justify-between bg-light-primary p-5 inset-shadow-sm/25 ${roundedTop ? 'rounded-t-2xl' : ''}`}
>
	<div class="flex flex-col items-start">
		<h2 class="text-3xl font-semibold">{workflowDocument.Title}</h2>
		<div class="flex flex-row items-center">
			<p>Status: {IntToStatusString(workflowDocument.Status)}</p>
			<div class="{IntToStatusColour(workflowDocument.Status)} ml-10 h-2 w-2 rounded-full"></div>
		</div>
		<p>Last modified: {workflowDocument.UpdatedAt}</p>
	</div>

	<div class="flex gap-4">
		<ButtonSvg type="eye" />
		<ButtonSvg type="edit" onClick={handleEdit} />
		<ButtonSvg type="trash" onClick={handleDelete} />
	</div>
</div>
