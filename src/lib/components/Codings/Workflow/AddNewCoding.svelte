<script lang="ts">
	import ButtonSvg from '../../Buttons/ButtonSvg.svelte';
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
	let isSubmitting = $state(false);
	let errorMessage = $state('');

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
		isSubmitting = false;
		errorMessage = '';
	}

	async function handleSubmit() {
		if (!codingName.trim() || !codingNumber || codingNumber === '') {
			errorMessage = 'Please fill in all required fields';
			return;
		}

		isSubmitting = true;
		errorMessage = '';

		// Create FormData to POST to the server
		const formData = new FormData();
		formData.append('name', codingName.trim());
		formData.append('description', codingDescription.trim());
		formData.append('number', codingNumber);
		formData.append('type', type.toLowerCase());
		// Match the codings page behavior: always include parent_id, use empty string for null
		formData.append('parent_id', (parentId !== null && parentId !== undefined && parentId > 0) ? parentId.toString() : '');

		try {
			const response = await fetch('/codings?/codings', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				errorMessage = 'Failed to create coding. Please try again.';
				isSubmitting = false;
				return;
			}

			const result = await response.json();
			let responseData = result.data;
			
			// Parse response data if it's a string
			if (typeof responseData === 'string') {
				try {
					responseData = JSON.parse(responseData);
				} catch (e) {
					errorMessage = 'Invalid response from server';
					isSubmitting = false;
					return;
				}
			}
			
			// Extract the coding ID from the response
			const codingId = extractCodingId(responseData);
			
			if (codingId && codingId > 0) {
			const newCoding: Coding = {
				id: codingId,
				name: codingName.trim(),
				number: parseInt(codingNumber),
				type: type.toLowerCase(),
					description: codingDescription.trim(),
					parent_id: parentId ?? undefined,
					children: []
				};

				if (onCodingCreated) {
					onCodingCreated({ ...newCoding, isNewlyCreated: true } as any);
				}

				closeModal();
			} else {
				errorMessage = 'Failed to get coding ID from server';
				isSubmitting = false;
			}
		} catch (error) {
			errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
			isSubmitting = false;
		}
	}

	// Extract coding ID from various response formats
	function extractCodingId(responseData: any): number | null {
		if (Array.isArray(responseData)) {
			if (responseData.length > 3 && typeof responseData[3] === 'number') {
				return responseData[3];
			}
			if (responseData[0]?.data) {
				return responseData[0].data;
			}
			if (responseData[2]?.id && typeof responseData[2].id === 'number') {
				return responseData[2].id;
			}
		}
		
		if (responseData?.id) return responseData.id;
		if (responseData?.data?.id) return responseData.data.id;
		if (typeof responseData === 'number') return responseData;
		
		return null;
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

				{#if errorMessage}
					<div class="text-red-600 text-sm p-2 bg-red-50 rounded-lg">
						{errorMessage}
					</div>
				{/if}

				<div class="flex gap-3 mt-2">
					<button
						type="button"
						onclick={closeModal}
						disabled={isSubmitting}
						class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={!codingName.trim() || !codingNumber || codingNumber === '' || isSubmitting}
						class="flex-1 px-4 py-2 bg-light-button-primary text-white rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Creating...' : 'Create & Add'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
