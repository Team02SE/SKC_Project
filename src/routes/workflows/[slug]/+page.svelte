<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ButtonSvg from '$lib/components/ButtonSvg.svelte';
	import CodingsEssence from '$lib/components/CodingsEssence.svelte';
	import SidenNav from '$lib/components/SidenNav.svelte';
	import CodingsSection from '$lib/components/CodingsSection.svelte';
	import type { PageProps } from './$types';
	import type { EssenceData, Coding } from '$lib/types';
	import PDFView from '$lib/components/PDFView.svelte';
	import { invalidateAll } from '$app/navigation';
	import {
		createEmptyPendingState,
		addCodingToPending,
		getTotalPendingCount,
		hasPendingChanges,
		mergeCodingsWithPending,
		addPendingCodingsToWorkflow,
		addCodingToPendingDeletions,
		removePendingDeletions,
		type PendingCodingsState,
		type CodingType
	} from '$lib/utils/codingHelpers';

	let { data }: PageProps = $props();

	let workflow = $state(data.workflowData);
	let pendingCodings = $state<PendingCodingsState>(createEmptyPendingState());
	
	$effect(() => {
		workflow = data.workflowData;
	});
	let isSaving = $state(false);

	let document = $derived(workflow.Document);

	let essenceContent = $derived<EssenceData>({
		essence: document?.Essence || '',
		summary: '',
		conclusion: document?.Conclusion || ''
	});

	let activities = $derived(mergeCodingsWithPending(workflow.Activities, pendingCodings.activities, pendingCodings.pendingDeletions));
	let effects = $derived(mergeCodingsWithPending(workflow.Effects, pendingCodings.effects, pendingCodings.pendingDeletions));
	let dsteps = $derived(mergeCodingsWithPending(workflow.Dsteps, pendingCodings.dsteps, pendingCodings.pendingDeletions));
	let opportunityStructures = $derived(mergeCodingsWithPending(workflow.Os, pendingCodings.os, pendingCodings.pendingDeletions));
	let systemVulnerabilities = $derived(mergeCodingsWithPending(workflow.Sv, pendingCodings.sv, pendingCodings.pendingDeletions));

	let allActivities = $derived(data.allCodings?.activities || []);
	let allEffects = $derived(data.allCodings?.effects || []);
	let allDsteps = $derived(data.allCodings?.dsteps || []);
	let allOpportunityStructures = $derived(data.allCodings?.opportunityStructures || []);
	let allSystemVulnerabilities = $derived(data.allCodings?.systemVulnerabilities || []);

	let containerRef: HTMLDivElement | null = null;
	let essenceRef: HTMLDivElement | null = null;
	let activitiesRef: HTMLDivElement | null = null;
	let effectsRef: HTMLDivElement | null = null;
	let destepRef: HTMLDivElement | null = null;
	let osRef: HTMLDivElement | null = null;
	let svRef: HTMLDivElement | null = null;

	let selectedId = $state<
		'essence' | 'activities' | 'effects' | 'destep' | 'opportunity' | 'vulnerabilities' | null
	>(null);

	function onContainerScroll() {
		if (!containerRef) return;
		const containerTop = containerRef.getBoundingClientRect().top;
		const sections = [
			{ id: 'essence', ref: essenceRef },
			{ id: 'activities', ref: activitiesRef },
			{ id: 'effects', ref: effectsRef },
			{ id: 'destep', ref: destepRef },
			{ id: 'opportunity', ref: osRef },
			{ id: 'vulnerabilities', ref: svRef }
		];

		let minDiff = Infinity;
		let nearest: typeof selectedId = null;
		for (const s of sections) {
			if (!s.ref) continue;
			const rect = s.ref.getBoundingClientRect();
			const diff = Math.abs(rect.top - containerTop);
			if (diff < minDiff) {
				minDiff = diff;
				nearest = s.id as any;
			}
		}
		selectedId = nearest;
	}

	function scrollToSection(id: string) {
		const map: Record<string, HTMLDivElement | null> = {
			essence: essenceRef,
			activities: activitiesRef,
			effects: effectsRef,
			destep: destepRef,
			opportunity: osRef,
			vulnerabilities: svRef
		};

		const target = map[id];
		if (!target || !containerRef) return;

		// compute offset of target relative to container's content
		const containerRect = containerRef.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const offsetTop = targetRect.top - containerRect.top + containerRef.scrollTop;

		// small offset so the section isn't flush to the container top
		const topPadding = 8;
		containerRef.scrollTo({ top: Math.max(0, offsetTop - topPadding), behavior: 'smooth' });
	}

	function handleCodingAdded<T extends Coding>(coding: T, type: CodingType) {
		pendingCodings = addCodingToPending(pendingCodings, type, coding);
	}

	function handleCodingDeleted(codingId: number, type: CodingType) {
		pendingCodings = addCodingToPendingDeletions(pendingCodings, codingId);
	}

	async function saveAllChanges() {
		isSaving = true;
		try {
			const updatedWorkflow = {
				...workflow,
				Activities: removePendingDeletions(
					addPendingCodingsToWorkflow(workflow.Activities || [], pendingCodings.activities),
					pendingCodings.pendingDeletions
				),
				Effects: removePendingDeletions(
					addPendingCodingsToWorkflow(workflow.Effects || [], pendingCodings.effects),
					pendingCodings.pendingDeletions
				),
				Dsteps: removePendingDeletions(
					addPendingCodingsToWorkflow(workflow.Dsteps || [], pendingCodings.dsteps),
					pendingCodings.pendingDeletions
				),
				Os: removePendingDeletions(
					addPendingCodingsToWorkflow(workflow.Os || [], pendingCodings.os),
					pendingCodings.pendingDeletions
				),
				Sv: removePendingDeletions(
					addPendingCodingsToWorkflow(workflow.Sv || [], pendingCodings.sv),
					pendingCodings.pendingDeletions
				)
			};

			const response = await fetch(`/api/workflows/${workflow.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedWorkflow)
			});

			if (!response.ok) {
				throw new Error(`Failed to save changes: ${response.statusText}`);
			}

			pendingCodings = createEmptyPendingState();
			await invalidateAll();
		} catch (error) {
			console.error('Error saving changes:', error);
		} finally {
			isSaving = false;
		}
	}

	let hasChanges = $derived(hasPendingChanges(pendingCodings));
	let pendingCount = $derived(getTotalPendingCount(pendingCodings));
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

	<SidenNav {selectedId} on:selectSection={(e) => scrollToSection(e.detail)} />

	<!-- Middle content -->
	<div
		bind:this={containerRef}
		onscroll={onContainerScroll}
		class="flex h-[calc(100vh-240px)] w-5/12 flex-col gap-5 overflow-y-auto rounded-2xl bg-light-primary p-5 inset-shadow-sm/25"
	>
		<div bind:this={essenceRef}><CodingsEssence data={essenceContent} /></div>
		<div bind:this={activitiesRef}>
			<CodingsSection
				title="Activities"
				type="activities"
				data={activities}
				availableCodings={allActivities}
				documentId={workflow.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'activities')}
				onDeleteRequest={(codingId) => handleCodingDeleted(codingId, 'activities')}
			/>
		</div>
		<div bind:this={effectsRef}>
			<CodingsSection
				title="Effects"
				type="effects"
				data={effects}
				availableCodings={allEffects}
				documentId={workflow.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'effects')}
				onDeleteRequest={(codingId) => handleCodingDeleted(codingId, 'effects')}
			/>
		</div>
		<div bind:this={destepRef}>
			<CodingsSection
				title="DESTEP"
				type="dsteps"
				data={dsteps}
				availableCodings={allDsteps}
				documentId={workflow.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'dsteps')}
				onDeleteRequest={(codingId) => handleCodingDeleted(codingId, 'dsteps')}
			/>
		</div>
		<div bind:this={osRef}>
			<CodingsSection
				title="Opportunity Structures"
				type="opportunity-structures"
				data={opportunityStructures}
				availableCodings={allOpportunityStructures}
				documentId={workflow.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'os')}
				onDeleteRequest={(codingId) => handleCodingDeleted(codingId, 'os')}
			/>
		</div>
		<div bind:this={svRef}>
			<CodingsSection
				title="System Vulnerabilities - Clustering"
				type="system-vulnerabilities"
				data={systemVulnerabilities}
				availableCodings={allSystemVulnerabilities}
				documentId={workflow.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'sv')}
				onDeleteRequest={(codingId) => handleCodingDeleted(codingId, 'sv')}
			/>
		</div>
	</div>

	<!-- Right content -->
	<div
		class="flex h-[calc(100vh-240px)] flex-1 items-center justify-center rounded-2xl bg-light-primary p-5 inset-shadow-sm/25"
	>
		<PDFView />
	</div>
</div>
