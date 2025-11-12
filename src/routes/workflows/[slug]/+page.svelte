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
	import type { EssenceData } from '$lib/types';
	import PDFView from '$lib/components/PDFView.svelte';
	import { error } from 'console';

	let { data }: PageProps = $props();

	let workflow = $state(data);
	console.log(data);

	let essenceContent = $derived<EssenceData>({
		essence: '',
		summary: '',
		conclusion: ''
	});

	let activities = $derived(workflow.activities);
	let effects = $derived(workflow.effects);
	let dsteps = $derived(workflow.dstep);
	let opportunityStructures = $derived(workflow.os);
	let systemVulnerabilities = $derived(workflow.sv);

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
</script>

<!-- Top bar -->
<div class="sticky top-20 flex h-18 w-full items-center p-4">
	<ButtonSvg type="home" size={12} />
	<div class="mx-4 h-10 w-px bg-light-text-primary"></div>
	<div class="flex h-full w-64 items-center justify-center rounded-t-2xl bg-light-navbar-primary">
		<p class="px-1 font-medium text-light-primary">Editing - {workflow.document.id}</p>
	</div>
</div>

<div class="flex w-full gap-5 px-4 py-2">
	<!-- Left sidebar -->
	<SidenNav {selectedId} on:selectSection={(e) => scrollToSection(e.detail)} />

	<!-- Middle content -->
	<div
		bind:this={containerRef}
		onscroll={onContainerScroll}
		class="flex h-[calc(100vh-240px)] w-5/12 flex-col gap-5 overflow-y-auto rounded-2xl bg-light-primary p-5 inset-shadow-sm/25"
	>
		<div bind:this={essenceRef}><CodingsEssence data={essenceContent} /></div>
		<div bind:this={activitiesRef}><CodingsActivities data={activities} /></div>
		<div bind:this={effectsRef}><CodingsEffects data={effects} /></div>
		<div bind:this={destepRef}><CodingsDESTEP data={dsteps} /></div>
		<div bind:this={osRef}><CodingsOS data={opportunityStructures} /></div>
		<div bind:this={svRef}><CodingsSV data={systemVulnerabilities} /></div>
	</div>

	<!-- Right content -->
	<div
		class="flex h-[calc(100vh-240px)] flex-1 items-center justify-center rounded-2xl bg-light-primary p-5 inset-shadow-sm/25"
	>
		<PDFView />
	</div>
</div>
