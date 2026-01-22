<script lang="ts">
	import { page } from '$app/stores';
	import NavBarEntry from './NavBarEntry.svelte';

	function handleUploadClick() {
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('open-upload-modal'));
		}
	}
</script>

<!--This component is the navbar located within the header of each page-->

<nav class="flex items-center bg-white px-6 py-3 shadow-md">
	<!-- Left section: nav links -->
	<ul class="ml-24 flex gap-6">
		<NavBarEntry displayName="Workflow" targetUrl="/" />
		<NavBarEntry displayName="Codings" targetUrl="/codings" />
		<!--  <NavBarEntry displayName="Dashboard" targetUrl="/dashboard" /> -->
	</ul>

	<!-- Middle spacer -->
	<div class="flex-grow"></div>

	<!-- Right button -->
	<div class="mr-24">
		<button
			type="button"
			class="rounded-2xl bg-orange-400 px-4 py-1.5 text-xl font-semibold text-white transition hover:cursor-pointer active:bg-orange-500"
			onclick={handleUploadClick}
		>
			Upload
		</button>
	</div>
</nav>
