<script lang="ts">
	import Toast from './Toast.svelte';
	import type { ToastData } from './toastStore.svelte';

	interface Props {
		toasts: ToastData[];
		onRemove: (id: string) => void;
	}

	let { toasts, onRemove }: Props = $props();
</script>

<div class="pointer-events-none fixed right-4 top-20 z-50 flex flex-col gap-3">
	{#each toasts as toast (toast.id)}
		<Toast
			message={toast.message}
			type={toast.type}
			duration={toast.duration}
			onClose={() => onRemove(toast.id)}
		/>
	{/each}
</div>
