<script lang="ts">
	import PDFView from './PDFView.svelte';
	import MetaView from './MetaView.svelte';
	import Toggle from '../Forms/Toggle.svelte';
	import ButtonSvg from '../Buttons/ButtonSvg.svelte';
	import ButtonText from '../Buttons/ButtonText.svelte';
	import { goto } from '$app/navigation';
	import type { WorkflowDocument } from '$lib/types';

	interface Props {
		workflowDocument: WorkflowDocument;
	}

	let { workflowDocument }: Props = $props();

	function handleOnClick() {
		goto(`workflows/${workflowDocument.id}`);
	}
</script>

<div
	class="flex h-full w-full flex-col items-start rounded-t-2xl border border-gray-200 bg-light-primary shadow-md inset-shadow-sm/25"
>
	<!-- Header Section -->
	<div class="mt-7 flex flex-col justify-center px-10 lg:w-full lg:items-center">
		<!-- Left: Big title -->
		<div class="text-4xl font-bold text-gray-800">
			{workflowDocument.Title}
		</div>

		<!-- Center: Author and Date -->
		<div class="self-start text-left">
			<div class="text-sm text-gray-600">
				Author: <span class="font-medium text-gray-800">{workflowDocument.Source}</span>
			</div>
			<div class="text-sm text-gray-600">
				Published: <span class="font-medium text-gray-800">{workflowDocument.CreatedAt}</span>
			</div>
		</div>
	</div>
	<div class="mt-5 w-10 pl-10">
		<ButtonText text="Edit" onClick={handleOnClick} />
	</div>

	<!-- Bottom Section -->
	<div class="flex w-full flex-1 flex-col overflow-hidden p-10 pt-5">
		<div class="w-full flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 p-4">
			<MetaView {workflowDocument} allowEdit={false} />
		</div>
	</div>
</div>
