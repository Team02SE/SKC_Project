<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ButtonSvg from '$lib/components/ButtonSvg.svelte';
	import CodingsEssence from '$lib/components/CodingsEssence.svelte';
	import SidenNav from '$lib/components/SidenNav.svelte';
	import CodingsActivities from '$lib/components/CodingsActivities.svelte';
	import CodingsEffects from '$lib/components/CodingsEffects.svelte';
	import CodingsDESTEP from '$lib/components/CodingsDESTEP.svelte';
	import CodingsOS from '$lib/components/CodingsOS.svelte';
	import CodingsSV from '$lib/components/CodingsSV.svelte';
	import type { PageProps } from './$types';
	import type {
		EssenceData,
		Activity,
		Effect,
		DStep,
		OpportunityStructure,
		SystemVulnerability,
		Coding
	} from '$lib/types';
	import PDFView from '$lib/components/PDFView.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data }: PageProps = $props();

	let workflow = $state(data.workflowData);
	let pendingActivities = $state<Activity[]>([]);
	let pendingEffects = $state<Effect[]>([]);
	let pendingDsteps = $state<DStep[]>([]);
	let pendingOS = $state<OpportunityStructure[]>([]);
	let pendingSV = $state<SystemVulnerability[]>([]);
	let isSaving = $state(false);

	function normalizeCodingsData<T extends { children: any }>(items: T[]): T[] {
		return items.map((item) => ({
			...item,
			children:
				item.children === null
					? []
					: item.children.map((child: any) => ({
							...child,
							children: child?.children === null ? [] : child?.children || []
						}))
		}));
	}

	let document = $derived(data.documentData);

	let essenceContent = $derived<EssenceData>({
		essence: document?.docu || '',
		summary: '',
		conclusion: document?.Conclusion || ''
	});

	let activities = $derived([
		...normalizeCodingsData(workflow.Activities || []),
		...pendingActivities.map((a) => ({ ...a, children: [], isNew: true }))
	]);
	let effects = $derived([
		...normalizeCodingsData(workflow.Effects || []),
		...pendingEffects.map((e) => ({ ...e, children: [], isNew: true }))
	]);
	let dsteps = $derived([
		...normalizeCodingsData(workflow.Dsteps || []),
		...pendingDsteps.map((d) => ({ ...d, children: [], isNew: true }))
	]);
	let opportunityStructures = $derived([
		...normalizeCodingsData(workflow.Os || []),
		...pendingOS.map((o) => ({ ...o, children: [], isNew: true }))
	]);
	let systemVulnerabilities = $derived([
		...normalizeCodingsData(workflow.Sv || []),
		...pendingSV.map((s) => ({ ...s, children: [], isNew: true }))
	]);

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

	function handleCodingAdded<T extends Coding>(
		coding: T,
		type: 'activities' | 'effects' | 'dsteps' | 'os' | 'sv'
	) {
		switch (type) {
			case 'activities':
				pendingActivities = [...pendingActivities, coding as Activity];
				break;
			case 'effects':
				pendingEffects = [...pendingEffects, coding as Effect];
				break;
			case 'dsteps':
				pendingDsteps = [...pendingDsteps, coding as DStep];
				break;
			case 'os':
				pendingOS = [...pendingOS, coding as OpportunityStructure];
				break;
			case 'sv':
				pendingSV = [...pendingSV, coding as SystemVulnerability];
				break;
		}
	}

	async function saveAllChanges() {
		isSaving = true;
		try {
			let updatedWorkflow = workflow;

			updatedWorkflow.Activities.push(...pendingActivities);
			updatedWorkflow.Effects.push(...pendingEffects);
			updatedWorkflow.Dsteps.push(...pendingDsteps);
			updatedWorkflow.Os.push(...pendingOS);
			updatedWorkflow.Sv.push(...pendingSV);

			const response = await fetch(`/api/workflows/${workflow.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedWorkflow)
			});

			if (!response.ok) {
				// remove from the workflow in case update fails
				throw new Error(`Failed to save changes: ${response.statusText}`);
			}

			pendingActivities = [];
			pendingEffects = [];
			pendingDsteps = [];
			pendingOS = [];
			pendingSV = [];

			await invalidateAll();
		} catch (error) {
			console.error('Error saving changes:', error);
		} finally {
			pendingActivities = [];
			pendingEffects = [];
			pendingDsteps = [];
			pendingOS = [];
			pendingSV = [];
			isSaving = false;
		}
	}

	let hasChanges = $derived(
		pendingActivities.length > 0 ||
			pendingEffects.length > 0 ||
			pendingDsteps.length > 0 ||
			pendingOS.length > 0 ||
			pendingSV.length > 0
	);
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
				{pendingActivities.length +
					pendingEffects.length +
					pendingDsteps.length +
					pendingOS.length +
					pendingSV.length} unsaved change{pendingActivities.length +
					pendingEffects.length +
					pendingDsteps.length +
					pendingOS.length +
					pendingSV.length ===
				1
					? ''
					: 's'}
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
			<CodingsActivities
				data={activities}
				availableCodings={allActivities}
				documentId={workflow.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'activities')}
			/>
		</div>
		<div bind:this={effectsRef}>
			<CodingsEffects
				data={effects}
				availableCodings={allEffects}
				documentId={workflow.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'effects')}
			/>
		</div>
		<div bind:this={destepRef}>
			<CodingsDESTEP
				data={dsteps}
				availableCodings={allDsteps}
				documentId={workflow.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'dsteps')}
			/>
		</div>
		<div bind:this={osRef}>
			<CodingsOS
				data={opportunityStructures}
				availableCodings={allOpportunityStructures}
				documentId={workflow.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'os')}
			/>
		</div>
		<div bind:this={svRef}>
			<CodingsSV
				data={systemVulnerabilities}
				availableCodings={allSystemVulnerabilities}
				documentId={workflow.id}
				onCodingAdded={(coding) => handleCodingAdded(coding, 'sv')}
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
