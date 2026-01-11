<script lang="ts">
	interface Props {
		reason: string;
		sectionId: number;
		onReasonChange: Function;
		onClose: Function;
	}

	let { reason, sectionId, onReasonChange, onClose }: Props = $props();

	let reasonChagne = $derived(reason);
</script>

<div class="absolute inset-0 z-30 flex w-full items-center justify-center">
	<div class="rounded-xl bg-white p-4 inset-shadow-sm/25">
		<label
			for={`reasoning-${sectionId}`}
			class="text-light-text-secondary mb-2 block text-xs font-semibold tracking-wide uppercase"
		>
			Reasoning
		</label>
		<textarea
			id={`reasoning-${sectionId}`}
			class="min-h-[5rem] w-full resize-none border-0 bg-transparent p-0 text-sm text-light-text-primary outline-none focus:ring-0"
			placeholder="Add brief explanation of why certain codings were chosen or left blank..."
			bind:value={reasonChagne}
			oninput={(event) => onReasonChange(reasonChagne)}
		></textarea>
		<button
			class="bg-red-500 p-2 text-white"
			onclick={() => {
				onClose();
			}}
		>
			Close</button
		>
	</div>
</div>
