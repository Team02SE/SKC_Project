<script lang="ts">
	interface Props {
		reason: string;
		sectionId: number;
		onReasonChange: Function;
		onClose: Function;
	}

	let { reason, sectionId, onReasonChange, onClose }: Props = $props();

	let reasonText = $state(reason);

	function handleOverlayClick() {
		onClose();
	}

	function handleModalClick(e: MouseEvent) {
		e.stopPropagation();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<div
	class="absolute inset-0 z-50 flex items-center justify-center bg-black/20"
	role="button"
	tabindex="0"
	onclick={handleOverlayClick}
	onkeydown={handleKeydown}
>
	<div
		class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
		role="dialog"
		aria-modal="true"
		aria-labelledby="reasoning-title"
		tabindex="-1"
		onclick={handleModalClick}
		onkeydown={(e) => e.stopPropagation()}
	>
		<div class="mb-4 flex items-center justify-between">
			<h3 id="reasoning-title" class="text-xl font-semibold text-light-text-primary">
				Edit Reasoning
			</h3>
			<button class="text-2xl leading-none text-gray-500 hover:text-gray-700 transition-colors" onclick={handleOverlayClick} aria-label="Close">
				×
			</button>
		</div>

		<div>
			<label for={`reasoning-${sectionId}`} class="mb-2 block text-sm font-medium text-gray-700">
				Reasoning
			</label>
			<textarea
				id={`reasoning-${sectionId}`}
				class="min-h-[120px] w-full resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm text-light-text-primary placeholder-gray-400 outline-none focus:ring-2 focus:ring-light-button-primary"
				placeholder="Add brief explanation of why certain codings were chosen..."
				bind:value={reasonText}
				oninput={() => onReasonChange(reasonText)}
			></textarea>
		</div>

		<div class="mt-4 flex justify-end">
			<button type="button" class="rounded-lg bg-light-button-primary px-4 py-2 text-sm font-medium text-white transition hover:brightness-110" onclick={handleOverlayClick}>
				Close
			</button>
		</div>
	</div>
</div>
