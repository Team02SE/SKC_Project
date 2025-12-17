<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import Toggle from '../Forms/Toggle.svelte';
	import MetaView from './MetaView.svelte';
	import MetadataCard from '../Cards/MetadataCard.svelte';
	import type { WorkflowDocument } from '$lib/types';
	import { fade } from 'svelte/transition';

	interface Props {
		pdfUrl?: string;
		scale?: number;
		useProxy?: boolean;
		pdfMetadata: WorkflowDocument;
	}

	let { pdfUrl, scale, useProxy, pdfMetadata }: Props = $props();

	const originalPdfUrl = $derived(
		pdfUrl ??
			'https://hz.nl/uploads/documents/1.4-Over-de-HZ/1.4.3.-Regelingen-en-documenten/OERS/2023-2024/Juli/TWE/IR-B-HBO-ICT-full-time-2023-2024-DEF.pdf'
	);
	const useproxy = $derived(useProxy ?? true);
	const pdfurl = $derived(
		useproxy ? `/api/pdf?url=${encodeURIComponent(originalPdfUrl)}` : originalPdfUrl
	);

	let Scale: number = $state(scale ?? 1.25);
	let canvasContainer: HTMLDivElement | undefined = $state();
	let currentPage = $state(1);
	let totalPages = $state(0);
	let pdfDoc: any = $state(null);
	let isLoading = $state(true);
	let error: string | null = $state(null);
	let pdfjsLib: any = null;
	let showPdf: Boolean = $state(true);

	onMount(async () => {
		if (browser) {
			try {
				pdfjsLib = await import('pdfjs-dist');
				const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
				pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
				await loadPDF();
			} catch (err) {
				error = 'Failed to load PDF library';
				isLoading = false;
			}
		}
	});

	onDestroy(() => {
		if (pdfDoc) {
			pdfDoc.destroy();
		}
	});

	// Re-render when scale changes
	$effect(() => {
		if (canvasContainer && pdfDoc) {
			renderPage(currentPage);
		}
	});

	async function loadPDF() {
		if (!pdfjsLib) return;

		try {
			isLoading = true;
			error = null;

			if (pdfDoc) {
				pdfDoc.destroy();
			}

			const loadingTask = pdfjsLib.getDocument(pdfurl);
			pdfDoc = await loadingTask.promise;
			totalPages = pdfDoc.numPages;
			currentPage = 1;

			await renderPage(1);

			isLoading = false;
		} catch (err: any) {
			error = err.message || 'Failed to load PDF';
			isLoading = false;
		}
	}

	async function renderPage(pageNumber: number) {
		if (!pdfDoc || !canvasContainer) return;

		try {
			const page = await pdfDoc.getPage(pageNumber);
			const viewport = page.getViewport({ scale: Scale });

			canvasContainer.innerHTML = '';

			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');

			if (!context) {
				return;
			}

			canvas.height = viewport.height;
			canvas.width = viewport.width;
			canvas.className = 'mx-auto';

			canvasContainer.appendChild(canvas);

			const renderContext = {
				canvasContext: context,
				viewport: viewport
			};

			await page.render(renderContext).promise;
		} catch (err) {
			console.log('Error rendering page:', err);
			error = 'Failed to render page';
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function previousPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function zoomIn() {
		Scale += 0.25;
		if (Scale > 1.5) {
			Scale = 1.5;
		}
	}

	function zoomOut() {
		if (Scale > 0.5) {
			Scale -= 0.25;
		}
	}

	function handlePageInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const pageNum = parseInt(input.value);
		if (pageNum >= 1 && pageNum <= totalPages) {
			currentPage = pageNum;
		}
	}

	function handlePageInputBlur(event: Event) {
		const input = event.target as HTMLInputElement;
		const pageNum = parseInt(input.value);
		if (!pageNum || pageNum < 1 || pageNum > totalPages) {
			input.value = currentPage.toString();
		}
	}

	function onToggle(val: Boolean) {
		showPdf = val;
	}
</script>

<div class="flex h-full w-full flex-col items-center">
	{#if isLoading}
		<div class="flex h-full items-center justify-center">
			<div class="text-light-text-primary">Loading PDF...</div>
		</div>
	{:else if error}
		<div class="flex h-full items-center justify-center">
			<div class="text-red-600">Error: {error}</div>
		</div>
	{:else}
		<div class="mb-10 self-start">
			<Toggle {onToggle} labelOn="Document" lebelOff="Metadata" />
		</div>
		{#if showPdf}
			<div
				class="mb-4 flex w-full items-center justify-between rounded-lg bg-light-primary px-4 py-2 shadow"
			>
				<div class="flex items-center gap-2">
					<button
						onclick={previousPage}
						disabled={currentPage <= 1}
						class="rounded bg-light-button-primary px-3 py-1 text-light-button-content-primary transition-colors hover:bg-light-active-primary disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50"
					>
						Previous
					</button>
					<div class="flex items-center gap-1">
						<span class="text-sm text-light-text-primary">Page</span>
						<input
							type="number"
							min="1"
							max={totalPages}
							value={currentPage}
							oninput={handlePageInput}
							onblur={handlePageInputBlur}
							class="w-16 rounded border border-light-secondary bg-light-primary px-2 py-1 text-center text-sm text-light-text-primary focus:border-light-active-primary focus:outline-none"
						/>
						<span class="text-sm text-light-text-primary">of {totalPages}</span>
					</div>
					<button
						onclick={nextPage}
						disabled={currentPage >= totalPages}
						class="rounded bg-light-button-primary px-3 py-1 text-light-button-content-primary transition-colors hover:bg-light-active-primary disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50"
					>
						Next
					</button>
				</div>

				<div class="flex items-center gap-2">
					<button
						onclick={zoomOut}
						class="rounded bg-light-button-primary px-3 py-1 text-light-button-content-primary transition-colors hover:bg-light-active-primary"
					>
						Zoom Out
					</button>
					<span class="text-sm text-light-text-primary">{Math.round(Scale * 100)}%</span>
					<button
						onclick={zoomIn}
						class="rounded bg-light-button-primary px-3 py-1 text-light-button-content-primary transition-colors hover:bg-light-active-primary"
					>
						Zoom In
					</button>
				</div>
			</div>

			<div class="flex-1 overflow-auto rounded bg-light-primary">
				<div bind:this={canvasContainer} class="min-h-full p-4"></div>
			</div>
		{:else}
			<MetaView allowEdit={true} workflowDocument={pdfMetadata} />
		{/if}
	{/if}
</div>
