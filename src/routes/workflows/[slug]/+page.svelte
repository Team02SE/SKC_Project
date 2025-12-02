<script lang="ts">
	import ButtonSvg from '$lib/components/ButtonSvg.svelte';
	import CodingsEssence from '$lib/components/CodingsEssence.svelte';
	import SidenNav from '$lib/components/SidenNav.svelte';
	import CodingsSection from '$lib/components/CodingsSection.svelte';
	import type { PageProps } from './$types';
	import type { EssenceData, Coding } from '$lib/types';
	import PDFView from '$lib/components/PDFView.svelte';
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
		{
			id: 'activities' as const,
			title: 'Activities',
			type: 'activities' as const,
			codingType: 'activities' as CodingType,
			workflowKey: 'Activities' as const,
			allCodingsKey: 'activities' as const
		},
		{
			id: 'effects' as const,
			title: 'Effects',
			type: 'effects' as const,
			codingType: 'effects' as CodingType,
			workflowKey: 'Effects' as const,
			allCodingsKey: 'effects' as const
		},
		{
			id: 'destep' as const,
			title: 'DESTEP',
			type: 'dsteps' as const,
			codingType: 'dsteps' as CodingType,
			workflowKey: 'Dsteps' as const,
			allCodingsKey: 'dsteps' as const
		},
		{
			id: 'opportunity' as const,
			title: 'Opportunity Structures',
			type: 'opportunity-structures' as const,
			codingType: 'os' as CodingType,
			workflowKey: 'Os' as const,
			allCodingsKey: 'opportunityStructures' as const
		},
		{
			id: 'vulnerabilities' as const,
			title: 'System Vulnerabilities - Clustering',
			type: 'system-vulnerabilities' as const,
			codingType: 'sv' as CodingType,
			workflowKey: 'Sv' as const,
			allCodingsKey: 'systemVulnerabilities' as const
		}
	];

	// Generate merged codings for each section
	const sections = $derived(
		sectionConfigs.map(config => ({
			...config,
			data: mergeCodingsWithPending(
				workflow[config.workflowKey],
				workflowState.pendingCodings[config.codingType],
				workflowState.pendingCodings.pendingDeletions,
				config.codingType
			),
			availableCodings: data.allCodings?.[config.allCodingsKey] || []
		}))
	);

	// Create a map of codings by type for state management
	let codingsMap = $derived<Record<CodingType, Coding[]>>(
		sections.reduce((acc, section) => {
			acc[section.codingType] = section.data;
			return acc;
		}, {} as Record<CodingType, Coding[]>)
	);

	// Section refs for navigation
	let containerRef: HTMLDivElement;
	let essenceRef: HTMLDivElement;
	let sectionRefs: Record<string, HTMLDivElement | undefined> = {};

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
		} catch (error) {
			console.error('Error saving changes:', error);
			alert('Failed to save changes. Please try again.');
		} finally {
			isSaving = false;
		}
	}

	let hasChanges = $derived(hasPendingChanges(workflowState.pendingCodings));
	let pendingCount = $derived(getTotalPendingCount(workflowState.pendingCodings));
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
			<ButtonSvg type="save" size={6} />
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
					type={section.type}
					data={section.data}
					availableCodings={section.availableCodings}
					documentId={document.id}
					onCodingAdded={(coding) => handleCodingAdded(coding, section.codingType)}
					onDeleteRequest={(codingId) => workflowState.handleCodingDeleted(codingId, section.codingType, codingsMap)}
					onCancelRequest={(codingId) => workflowState.handleCodingCanceled(codingId, section.codingType, codingsMap)}
				/>
			</div>
		{/each}
	</div>

	<!-- Right content -->
	<div
		class="flex h-[calc(100vh-240px)] flex-1 items-center justify-center rounded-2xl bg-light-primary p-5 inset-shadow-sm/25"
	>
		<PDFView pdfUrl={data.pdfUrl} />
	</div>
</div>