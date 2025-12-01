<script lang="ts">
	import ButtonSvg from './ButtonSvg.svelte';
	import type { Coding } from '$lib/types';

	interface Props {
		customClass?: string;
		type: string;
		onCodingCreated?: (coding: Coding) => void;
		parentId?: number | null;
		isOpen?: boolean;
		onClose?: () => void;
	}

	let { customClass = '', type, onCodingCreated, parentId = null, isOpen = false, onClose }: Props = $props();
	
	let codingName = $state('');
	let codingNumber = $state('');
	let codingDescription = $state('');

	function closeModal() {
		resetForm();
		if (onClose) {
			onClose();
		}
	}

	function resetForm() {
		codingName = '';
		codingNumber = '';
		codingDescription = '';
	}

	async function handleSubmit() {
		if (!codingName.trim() || !codingNumber || codingNumber === '') {
			return;
		}

		const newCoding: Coding = {
			id: Date.now(),
			name: codingName.trim(),
			number: parseInt(codingNumber.toString()),
			type: type,
			description: codingDescription.trim(),
			parent_id: parentId ?? undefined,
			children: null,
			isNew: true
		};

		if (onCodingCreated) {
			onCodingCreated(newCoding);
		}

		closeModal();
	}

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeModal();
		}
	}

	function handleModalKeydown(e: KeyboardEvent) {
		e.stopPropagation();
	}
</script>

{#if isOpen}
	<div
		class="absolute inset-0 z-50 flex items-center justify-center"
		role="button"
		tabindex="0"
		onclick={closeModal}
		onkeydown={handleOverlayKeydown}
	>
		<div
			class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl translate-y-5/11"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={handleModalKeydown}
		>
			<div class="mb-4 flex items-center justify-between">
				<h3 id="modal-title" class="text-xl font-semibold text-light-text-primary">Create New Coding</h3>
				<button
					class="text-2xl leading-none text-gray-500 hover:text-gray-700"
					onclick={closeModal}
					aria-label="Close"
				>
					×
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="flex flex-col gap-4">
				<div>
					<label for="codingNumber" class="block text-sm font-medium text-gray-700 mb-1">
						Number <span class="text-red-500">*</span>
					</label>
					<input
						id="codingNumber"
						type="number"
						bind:value={codingNumber}
						placeholder="Enter coding number"
						required
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-button-primary"
					/>
				</div>

				<div>
					<label for="codingName" class="block text-sm font-medium text-gray-700 mb-1">
						Name <span class="text-red-500">*</span>
					</label>
					<input
						id="codingName"
						type="text"
						bind:value={codingName}
						placeholder="Enter coding name"
						required
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-button-primary"
					/>
				</div>

				<div>
					<label for="codingDescription" class="block text-sm font-medium text-gray-700 mb-1">
						Description
					</label>
					<textarea
						id="codingDescription"
						bind:value={codingDescription}
						placeholder="Enter coding description (optional)"
						rows="3"
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-button-primary resize-none"
					></textarea>
				</div>

				<div class="flex gap-3 mt-2">
					<button
						type="button"
						onclick={closeModal}
						class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={!codingName.trim() || !codingNumber || codingNumber === ''}
						class="flex-1 px-4 py-2 bg-light-button-primary text-white rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Create
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
