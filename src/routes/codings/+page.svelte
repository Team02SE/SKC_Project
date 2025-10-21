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

	let essenceRef: HTMLDivElement | null = null;
	let activitiesRef: HTMLDivElement | null = null;
	let effectsRef: HTMLDivElement | null = null;
	let destepRef: HTMLDivElement | null = null;
	let osRef: HTMLDivElement | null = null;
	let svRef: HTMLDivElement | null = null;
</script>

<Header />

<!-- Top bar -->
<div class="sticky top-20 flex items-center w-full p-4 h-18">
	<ButtonSvg type="home" size={12} />
	<div class="mx-4 h-10 w-px bg-light-text-primary"></div>
	<div class="flex items-center justify-center h-full w-64 rounded-t-2xl bg-light-navbar-primary">
		<p class="px-1 font-medium text-light-primary">Editing - DOCUMENT_NAME</p>
	</div>
</div>

<div class="flex w-full gap-5 px-4 py-2">
	<!-- Left sidebar -->
	 <SidenNav on:selectSection={(e: CustomEvent<"essence" | "activities" | "effects" | "destep" | "opportunity" | "vulnerabilities">) => {
		const map: Record<"essence" | "activities" | "effects" | "destep" | "opportunity" | "vulnerabilities", HTMLDivElement | null> = {
			essence: essenceRef,
			activities: activitiesRef,
			effects: effectsRef,
			destep: destepRef,
			opportunity: osRef,
			vulnerabilities: svRef
		};
		map[e.detail]?.scrollIntoView({ behavior: "smooth" });
	}} />

	<!-- Middle content -->
	<div class="flex flex-col gap-5 overflow-y-auto rounded-2xl bg-light-primary p-5 h-[calc(100vh-240px)] w-5/12 inset-shadow-sm/25">
		<div bind:this={essenceRef}><CodingsEssence /></div>
		<div bind:this={activitiesRef}><CodingsActivities /></div>
		<div bind:this={effectsRef}><CodingsEffects /></div>
		<div bind:this={destepRef}><CodingsDESTEP /></div>
		<div bind:this={osRef}><CodingsOS /></div>
		<div bind:this={svRef}><CodingsSV /></div>
	</div>

	<!-- Right content -->
	<div class="flex flex-1 items-center justify-center rounded-2xl bg-light-primary p-20 h-[calc(100vh-240px)] inset-shadow-sm/25">
		<p class="text-4xl text-light-text-primary opacity-25">Select a document to see its preview</p>
	</div>
</div>