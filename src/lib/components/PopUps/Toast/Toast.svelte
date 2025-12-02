<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Props {
		message: string;
		type?: 'success' | 'error' | 'info' | 'warning';
		duration?: number;
		onClose?: () => void;
	}

	let { 
		message, 
		type = 'info', 
		duration = 3000,
		onClose = () => {}
	}: Props = $props();

	let visible = $state(true);

	$effect(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				visible = false;
				setTimeout(onClose, 300);
			}, duration);

			return () => clearTimeout(timer);
		}
	});

	function handleClose() {
		visible = false;
		setTimeout(onClose, 300);
	}

	const typeConfig = {
		success: { bg: 'bg-green-100', icon: '✓', border: 'border-green-300', text: 'text-green-800' },
		error: { bg: 'bg-red-100', icon: '✕', border: 'border-red-300', text: 'text-red-800' },
		warning: { bg: 'bg-amber-100', icon: '⚠', border: 'border-amber-300', text: 'text-amber-800' },
		info: { bg: 'bg-blue-100', icon: 'ℹ', border: 'border-blue-300', text: 'text-blue-800' }
	};

	const styles = $derived(typeConfig[type]);
</script>

{#if visible}
	<div
		class="pointer-events-auto flex min-w-[300px] max-w-md items-center gap-3 rounded-lg border {styles.border} {styles.bg} px-4 py-3 {styles.text} shadow-md"
		transition:fly={{ y: -50, duration: 300, easing: quintOut }}
		role="alert"
	>
		<span class="text-2xl font-bold">{styles.icon}</span>
		<p class="flex-1 text-sm font-medium">{message}</p>
		<button
			onclick={handleClose}
			class="ml-2 opacity-60 transition hover:opacity-100 focus:outline-none"
			aria-label="Close"
		>
			<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
{/if}
