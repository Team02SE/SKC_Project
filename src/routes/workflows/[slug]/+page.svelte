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
		removeCodingFromPendingDeletions,
		removeCodingFromPending,
		getAllCodingIds,
		findCodingById,
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

	let document = $derived(data.documentData);

	let essenceContent = $derived<EssenceData>({
		essence: document?.Essence || '',
		summary: '',
		conclusion: document?.Conclusion || ''
	});

	let activities = $derived(mergeCodingsWithPending(workflow.Activities, pendingCodings.activities, pendingCodings.pendingDeletions, 'activities'));
	let effects = $derived(mergeCodingsWithPending(workflow.Effects, pendingCodings.effects, pendingCodings.pendingDeletions, 'effects'));
	let dsteps = $derived(mergeCodingsWithPending(workflow.Dsteps, pendingCodings.dsteps, pendingCodings.pendingDeletions, 'dsteps'));
	let opportunityStructures = $derived(mergeCodingsWithPending(workflow.Os, pendingCodings.os, pendingCodings.pendingDeletions, 'os'));
	let systemVulnerabilities = $derived(mergeCodingsWithPending(workflow.Sv, pendingCodings.sv, pendingCodings.pendingDeletions, 'sv'));

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

		const containerRect = containerRef.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const offsetTop = targetRect.top - containerRect.top + containerRef.scrollTop;

		const topPadding = 8;
		containerRef.scrollTo({ top: Math.max(0, offsetTop - topPadding), behavior: 'smooth' });
	}

	function getCodingsByType(type: CodingType): Coding[] {
		return {
			activities,
			effects,
			dsteps,
			os: opportunityStructures,
			sv: systemVulnerabilities
		}[type];
	}

	function markCodingTreeForDeletion(codingId: number, type: CodingType): void {
		const coding = findCodingById(getCodingsByType(type), codingId);
		if (coding) {
			const allIds = getAllCodingIds(coding);
			let updatedState = pendingCodings;
			for (const id of allIds) {
				updatedState = addCodingToPendingDeletions(updatedState, id, type);
			}
			pendingCodings = updatedState;
		} else {
			pendingCodings = addCodingToPendingDeletions(pendingCodings, codingId, type);
		}
	}

	function unmarkCodingTreeFromDeletion(codingId: number, type: CodingType): void {
		const coding = findCodingById(getCodingsByType(type), codingId);
		if (coding) {
			const allIds = getAllCodingIds(coding);
			let updatedState = pendingCodings;
			for (const id of allIds) {
				updatedState = removeCodingFromPendingDeletions(updatedState, id, type);
			}
			pendingCodings = updatedState;
		} else {
			pendingCodings = removeCodingFromPendingDeletions(pendingCodings, codingId, type);
		}
	}

	async function handleCodingAdded<T extends Coding>(coding: T, type: CodingType) {
		pendingCodings = addCodingToPending(pendingCodings, type, coding);
		
		if ((coding as any).isNewlyCreated) {
			await invalidateAll();
		}
	}

	function handleCodingDeleted(codingId: number, type: CodingType) {
		markCodingTreeForDeletion(codingId, type);
	}

	function handleCodingCanceled(codingId: number, type: CodingType) {
		if (pendingCodings.pendingDeletions.has(`${type}:${codingId}`)) {
			unmarkCodingTreeFromDeletion(codingId, type);
		} else {
			pendingCodings = removeCodingFromPending(pendingCodings, type, codingId);
		}
	}

	function applyPendingChanges(workflowCodings: Coding[], pendingCodingsForType: Coding[], type: CodingType): Coding[] {
		return removePendingDeletions(
			addPendingCodingsToWorkflow(workflowCodings || [], pendingCodingsForType),
			pendingCodings.pendingDeletions,
			type
		);
	}

	async function createCoding(coding: Coding, typeString: string): Promise<Coding | null> {
		const formData = new FormData();
		formData.append('name', coding.name);
		formData.append('description', coding.description || '');
		formData.append('number', coding.number.toString());
		formData.append('type', typeString);
		if (coding.parent_id !== undefined && coding.parent_id !== null && coding.parent_id > 0) {
			formData.append('parent_id', coding.parent_id.toString());
		}

		try {
			console.log('Creating coding:', coding.name, 'type:', typeString);
			const response = await fetch('/codings?/codings', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				console.error('Failed to create coding:', coding.name, 'Status:', response.status);
				return null;
			}

			const result = await response.json();
			console.log('Raw result from server:', result);
			
			let parsedData = result.data;
			if (typeof parsedData === 'string') {
				parsedData = JSON.parse(parsedData);
			}
			
			const codingId = parsedData?.[0]?.data;
			console.log('Created coding ID:', codingId);
			
			if (codingId) {
				return {
					...coding,
					id: codingId
				};
			}
			
			return null;
		} catch (error) {
			console.error('Error creating coding:', error);
			return null;
		}
	}

	async function createNewCodingsAndBuildIdMap(
		codings: Coding[],
		typeString: string,
		idMap: Map<number, number>
	): Promise<void> {
		for (const coding of codings) {
			if (coding.id < 0) {
				const tempId = coding.id;
				console.log(`Processing new coding with temp ID ${tempId}:`, coding.name);
				
				const realParentId = coding.parent_id && coding.parent_id < 0
					? idMap.get(coding.parent_id)
					: coding.parent_id;

				console.log(`Parent ID: ${coding.parent_id} -> Real parent ID: ${realParentId}`);

				const codingToCreate = {
					...coding,
					parent_id: realParentId
				};

				const createdCoding = await createCoding(codingToCreate, typeString);
				if (createdCoding && createdCoding.id) {
					console.log(`Created coding ${coding.name} with ID ${createdCoding.id}, mapped from temp ID ${tempId}`);
					idMap.set(tempId, createdCoding.id);
				} else {
					console.error(`Failed to create coding: ${coding.name}`);
				}
			}

			if (coding.children && coding.children.length > 0) {
				await createNewCodingsAndBuildIdMap(coding.children, typeString, idMap);
			}
		}
	}

	function replaceTemporaryIds(codings: Coding[], idMap: Map<number, number>): Coding[] {
		return codings.map(coding => {
			const newId = coding.id < 0 ? (idMap.get(coding.id) ?? coding.id) : coding.id;
			const newParentId = coding.parent_id && coding.parent_id < 0
				? (idMap.get(coding.parent_id) ?? coding.parent_id)
				: coding.parent_id;

			return {
				...coding,
				id: newId,
				parent_id: newParentId,
				children: coding.children ? replaceTemporaryIds(coding.children, idMap) : []
			};
		}).filter(coding => coding.id >= 0);
	}

	async function saveAllChanges() {
		isSaving = true;
		try {
			let updatedWorkflow = {
				...workflow,
				Activities: applyPendingChanges(workflow.Activities, pendingCodings.activities, 'activities'),
				Effects: applyPendingChanges(workflow.Effects, pendingCodings.effects, 'effects'),
				Dsteps: applyPendingChanges(workflow.Dsteps, pendingCodings.dsteps, 'dsteps'),
				Os: applyPendingChanges(workflow.Os, pendingCodings.os, 'os'),
				Sv: applyPendingChanges(workflow.Sv, pendingCodings.sv, 'sv')
			};

			const idMap = new Map<number, number>();
			await createNewCodingsAndBuildIdMap(updatedWorkflow.Activities, 'activities', idMap);
			await createNewCodingsAndBuildIdMap(updatedWorkflow.Effects, 'effects', idMap);
			await createNewCodingsAndBuildIdMap(updatedWorkflow.Dsteps, 'dsteps', idMap);
			await createNewCodingsAndBuildIdMap(updatedWorkflow.Os, 'opportunity-structures', idMap);
			await createNewCodingsAndBuildIdMap(updatedWorkflow.Sv, 'system-vulnerabilities', idMap);

			updatedWorkflow = {
				...updatedWorkflow,
				Activities: replaceTemporaryIds(updatedWorkflow.Activities, idMap),
				Effects: replaceTemporaryIds(updatedWorkflow.Effects, idMap),
				Dsteps: replaceTemporaryIds(updatedWorkflow.Dsteps, idMap),
				Os: replaceTemporaryIds(updatedWorkflow.Os, idMap),
				Sv: replaceTemporaryIds(updatedWorkflow.Sv, idMap)
			};

			const response = await fetch(`/api/workflows/${document.id}`, {
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
			alert('Failed to save changes. Please try again.');
		} finally {
			isSaving = false;
		}
	}	let hasChanges = $derived(hasPendingChanges(pendingCodings));
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
		<div bind:this={osRef}>
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
		<div bind:this={svRef}>
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
		<PDFView />
	</div>
</div>
