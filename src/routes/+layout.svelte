<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Layout/Header.svelte';
	import NavBar from '$lib/components/Layout/NavBar.svelte';
	import UploadDocumentModal from '$lib/components/Documents/UploadDocumentModal.svelte';
	import ToastContainer from '$lib/components/PopUps/Toast/ToastContainer.svelte';
	import { toastStore } from '$lib/components/PopUps/Toast/toastStore.svelte';

	let { children } = $props();
	import { invalidateAll, onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	let showUploadModal = $state(false);

	onMount(() => {
		const openHandler = () => {
			showUploadModal = true;
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('open-upload-modal', openHandler);
		}

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('open-upload-modal', openHandler);
			}
		};
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	async function handleDocumentUploaded() {
		showUploadModal = false;
		await invalidateAll();
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $page.status < 400}
	<Header />
	<NavBar />
{/if}

{#if showUploadModal}
	<UploadDocumentModal
		on:close={() => (showUploadModal = false)}
		on:uploaded={handleDocumentUploaded}
	/>
{/if}

<ToastContainer toasts={toastStore.toasts} onRemove={(id) => toastStore.remove(id)} />

{@render children?.()}

<style></style>
