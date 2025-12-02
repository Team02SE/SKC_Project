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

	let activities = $derived(
		mergeCodingsWithPending(
			workflow.Activities,
			workflowState.pendingCodings.activities,
			workflowState.pendingCodings.pendingDeletions,
			'activities'
		)
	);
	let effects = $derived(
		mergeCodingsWithPending(
			workflow.Effects,
			workflowState.pendingCodings.effects,
			workflowState.pendingCodings.pendingDeletions,
			'effects'
		)
	);
	let dsteps = $derived(
		mergeCodingsWithPending(
			workflow.Dsteps,
			workflowState.pendingCodings.dsteps,
			workflowState.pendingCodings.pendingDeletions,
			'dsteps'
		)
	);
	let opportunityStructures = $derived(
		mergeCodingsWithPending(
			workflow.Os,
			workflowState.pendingCodings.os,
			workflowState.pendingCodings.pendingDeletions,
			'os'
		)
	);
	let systemVulnerabilities = $derived(
		mergeCodingsWithPending(
			workflow.Sv,
			workflowState.pendingCodings.sv,
			workflowState.pendingCodings.pendingDeletions,
			'sv'
		)
	);

	let allActivities = $derived(data.allCodings?.activities || []);
	let allEffects = $derived(data.allCodings?.effects || []);
	let allDsteps = $derived(data.allCodings?.dsteps || []);
	let allOpportunityStructures = $derived(data.allCodings?.opportunityStructures || []);
	let allSystemVulnerabilities = $derived(data.allCodings?.systemVulnerabilities || []);

	// Create a map of codings by type for state management
	let codingsMap = $derived<Record<CodingType, Coding[]>>({
		activities,
		effects,
		dsteps,
		os: opportunityStructures,
		sv: systemVulnerabilities
	});

	// Section refs for navigation
	let containerRef: HTMLDivElement;
	let essenceRef: HTMLDivElement;
	let activitiesRef: HTMLDivElement;
	let effectsRef: HTMLDivElement;
	let destepRef: HTMLDivElement;
	let opportunityRef: HTMLDivElement;
	let vulnerabilitiesRef: HTMLDivElement;

	$effect(() => {
		navigation.setContainerRef(containerRef);
	});

	$effect(() => {
		navigation.setSectionRef('essence', essenceRef);
		navigation.setSectionRef('activities', activitiesRef);
		navigation.setSectionRef('effects', effectsRef);
		navigation.setSectionRef('destep', destepRef);
		navigation.setSectionRef('opportunity', opportunityRef);
		navigation.setSectionRef('vulnerabilities', vulnerabilitiesRef);
	});

	async function handleCodingAdded<T extends Coding>(coding: T, type: CodingType) {
		workflowState.handleCodingAdded(coding, type);

		if ((coding as any).isNewlyCreated) {
			await invalidateAll();
		}
	}

	function handleCodingDeleted(codingId: number, type: CodingType) {
		workflowState.handleCodingDeleted(codingId, type, codingsMap);
	}

	function handleCodingCanceled(codingId: number, type: CodingType) {
		workflowState.handleCodingCanceled(codingId, type, codingsMap);
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
		<div bind:this={activitiesRef}>
			<CodingsSection
				title="Activities"
				type="activities"
				data={activities}
				availableCodings={allActivities}
				documentId={document.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'activities')}
				onDeleteRequest={(codingId) => handleCodingDeleted(codingId, 'activities')}
				onCancelRequest={(codingId) => handleCodingCanceled(codingId, 'activities')}
			/>
		</div>
		<div bind:this={effectsRef}>
			<CodingsSection
				title="Effects"
				type="effects"
				data={effects}
				availableCodings={allEffects}
				documentId={document.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'effects')}
				onDeleteRequest={(codingId) => handleCodingDeleted(codingId, 'effects')}
				onCancelRequest={(codingId) => handleCodingCanceled(codingId, 'effects')}
			/>
		</div>
		<div bind:this={destepRef}>
			<CodingsSection
				title="DESTEP"
				type="dsteps"
				data={dsteps}
				availableCodings={allDsteps}
				documentId={document.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'dsteps')}
				onDeleteRequest={(codingId) => handleCodingDeleted(codingId, 'dsteps')}
				onCancelRequest={(codingId) => handleCodingCanceled(codingId, 'dsteps')}
			/>
		</div>
		<div bind:this={opportunityRef}>
			<CodingsSection
				title="Opportunity Structures"
				type="opportunity-structures"
				data={opportunityStructures}
				availableCodings={allOpportunityStructures}
				documentId={document.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'os')}
				onDeleteRequest={(codingId) => handleCodingDeleted(codingId, 'os')}
				onCancelRequest={(codingId) => handleCodingCanceled(codingId, 'os')}
			/>
		</div>
		<div bind:this={vulnerabilitiesRef}>
			<CodingsSection
				title="System Vulnerabilities - Clustering"
				type="system-vulnerabilities"
				data={systemVulnerabilities}
				availableCodings={allSystemVulnerabilities}
				documentId={document.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'sv')}
				onDeleteRequest={(codingId) => handleCodingDeleted(codingId, 'sv')}
				onCancelRequest={(codingId) => handleCodingCanceled(codingId, 'sv')}
			/>
		</div>
	</div>

	<!-- Right content -->
	<div
		class="flex h-[calc(100vh-240px)] flex-1 items-center justify-center rounded-2xl bg-light-primary p-5 inset-shadow-sm/25"
	>
		<PDFView pdfUrl={data.pdfUrl} />
	</div>
</div>
