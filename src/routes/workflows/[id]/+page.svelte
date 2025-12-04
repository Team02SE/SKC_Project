<script lang="ts">
	import ButtonSvg from '$lib/components/Buttons/ButtonSvg.svelte';
	import CodingsEssence from '$lib/components/Codings/Workflow/CodingsEssence.svelte';
	import SidenNav from '$lib/components/Layout/SidenNav.svelte';
	import CodingsSection from '$lib/components/Codings/Workflow/CodingsSection.svelte';
	import type { PageProps } from './$types';
	import type { EssenceData, Coding } from '$lib/types';
	import PDFView from '$lib/components/Documents/PDFView.svelte';
	import { invalidateAll } from '$app/navigation';
	import {
		useWorkflowState,
		getTotalPendingCount,
		hasPendingChanges,
		mergeCodingsWithPending,
		type CodingType
	} from '$lib/utils/workflow/workflowState.svelte';
	import { saveWorkflowChanges } from '$lib/utils/workflow/workflowApi';
	import { useSectionNavigation } from '$lib/utils/navigation/sectionNavigation.svelte';
	import { toastStore } from '$lib/components/PopUps/Toast/toastStore.svelte';

	let { data }: PageProps = $props();

	let workflow = $state(data.workflowData);
	const workflowState = useWorkflowState();
	const navigation = useSectionNavigation();

	$effect(() => {
		workflow = data.workflowData;
	});
	let isSaving = $state(false);

	let document = $derived(data.documentData);

	let essenceContent = $derived<EssenceData>({
		essence: document?.Essence || '',
		summary: '',
		conclusion: document?.Conclusion || ''
	});

	// Section configuration with all metadata
	const sectionConfigs = [
		{ id: 'activities' as const, title: 'Activities' },
		{ id: 'effects' as const, title: 'Effects' },
		{ id: 'destep' as const, title: 'DESTEP' },
		{ id: 'opportunity-structures' as const, title: 'Opportunity Structures' },
		{ id: 'system-vulnerabilities' as const, title: 'System Vulnerabilities - Clustering' }
	];

	// Generate merged codings for each section
	const sections = $derived(
		sectionConfigs.map(config => ({
			...config,
			data: mergeCodingsWithPending(
				workflow[config.id],
				workflowState.pendingCodings[config.id],
				workflowState.pendingCodings.pendingDeletions,
				config.id
			),
			availableCodings: data.allCodings?.[config.id] || []
		}))
	);

	// Create a map of codings by type for state management
	let codingsMap = $derived<Record<CodingType, Coding[]>>(
		sections.reduce((acc, section) => {
			acc[section.id] = section.data;
			return acc;
		}, {} as Record<CodingType, Coding[]>)
	);

	let reasoningNotes = $state<Partial<Record<CodingType, string>>>({});

	// Section refs for navigation
	let containerRef: HTMLDivElement;
	let essenceRef: HTMLDivElement;
	let sectionRefs = $state<Record<string, HTMLDivElement | undefined>>({});

	$effect(() => {
		navigation.setContainerRef(containerRef);
	});

	$effect(() => {
		navigation.setSectionRef('essence', essenceRef);
		sections.forEach(section => {
			navigation.setSectionRef(section.id, sectionRefs[section.id] || null);
		});
	});

	async function handleCodingAdded<T extends Coding>(coding: T, type: CodingType) {
		workflowState.handleCodingAdded(coding, type);

		if ((coding as any).isNewlyCreated) {
			await invalidateAll();
		}
	}

	async function saveAllChanges() {
		isSaving = true;
		try {
			await saveWorkflowChanges(document.id, workflow, workflowState.pendingCodings);
			workflowState.resetPendingCodings();
			await invalidateAll();
			toastStore.success('Workflow saved successfully!');
		} catch (error) {
			console.error('Error saving changes:', error);
			toastStore.error('Failed to save changes. Please try again.');
		} finally {
			isSaving = false;
		}
	}

	let hasChanges = $derived(hasPendingChanges(workflowState.pendingCodings));
	let pendingCount = $derived(getTotalPendingCount(workflowState.pendingCodings));

	function handleReasoningChange(sectionId: CodingType, value: string) {
		reasoningNotes = {
			...reasoningNotes,
			[sectionId]: value
		};
	}
</script>

<!-- Top bar -->
<div class="sticky top-20 flex h-18 w-full items-center p-4">
	<ButtonSvg type="home" size={12} />
	<div class="mx-4 h-10 w-px bg-light-text-primary"></div>
	<div
		class="flex h-full w-64 items-center justify-center rounded-t-2xl bg-light-navbar-primary text-light-button-content-primary"
	>
		<h3>Editing - {document.Title}</h3>
	</div>
	<div class="ml-auto flex items-center gap-4">
		{#if hasChanges}
			<span class="text-sm text-gray-600">
				{pendingCount} unsaved change{pendingCount === 1 ? '' : 's'}
			</span>
		{/if}
		<button
			onclick={saveAllChanges}
			disabled={!hasChanges || isSaving}
			class="flex items-center gap-2 rounded-lg bg-light-button-primary px-4 py-2 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<ButtonSvg type="save" size={6} asChild={true} />
			<span class="font-semibold">{isSaving ? 'Saving...' : 'Save All'}</span>
		</button>
	</div>
</div>

<div class="flex w-full gap-5 px-4 py-2">
	<!-- Left sidebar-->

	<SidenNav
		selectedId={navigation.selectedId}
		on:selectSection={(e) => navigation.scrollToSection(e.detail)}
	/>

	<!-- Middle content -->
	<div
		bind:this={containerRef}
		onscroll={navigation.onContainerScroll}
		class="flex h-[calc(100vh-240px)] w-5/12 flex-col gap-5 overflow-y-auto rounded-2xl bg-light-primary p-5 inset-shadow-sm/25"
	>
		<div bind:this={essenceRef}>
			<CodingsEssence data={essenceContent} />
		</div>
		{#each sections as section (section.id)}
			<div bind:this={sectionRefs[section.id]}>
				<CodingsSection
					title={section.title}
					type={section.id}
					data={section.data}
					availableCodings={section.availableCodings}
					documentId={document.id}
					onCodingAdded={(coding) => handleCodingAdded(coding, section.id)}
					onDeleteRequest={(codingId) => workflowState.handleCodingDeleted(codingId, section.id, codingsMap)}
					onCancelRequest={(codingId) => workflowState.handleCodingCanceled(codingId, section.id, codingsMap)}
				/>
				<div class="rounded-xl bg-white/80 p-4 inset-shadow-sm/25">
					<label
						for={`reasoning-${section.id}`}
						class="mb-2 block text-xs font-semibold uppercase tracking-wide text-light-text-secondary"
					>
						Reasoning
					</label>
					<textarea
						id={`reasoning-${section.id}`}
						class="min-h-[5rem] w-full resize-none border-0 bg-transparent p-0 text-sm text-light-text-primary outline-none focus:ring-0"
						placeholder="Add brief explanation of why certain codings were chosen or left blank..."
						value={reasoningNotes[section.id] ?? ''}
						oninput={(event) =>
							handleReasoningChange(section.id, (event.target as HTMLTextAreaElement).value)}
					></textarea>
				</div>
			</div>
		{/each}
	</div>

	<!-- Right content -->
	<div
		class="flex h-[calc(100vh-240px)] flex-1 items-center justify-center rounded-2xl bg-light-primary p-5 inset-shadow-sm/25"
	>
		{#if data.pdfUrl}
			<PDFView pdfUrl={data.pdfUrl} />
		{:else}
			<div class="text-center text-gray-500">
				<p class="text-xl mb-2">PDF not available</p>
				<p class="text-sm">The document file could not be loaded</p>
			</div>
		{/if}
	</div>
</div>
