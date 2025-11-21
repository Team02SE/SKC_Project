<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ButtonSvg from './ButtonSvg.svelte';
	import ButtonText from './ButtonText.svelte';

	const dispatch = createEventDispatcher<{
		close: void;
		uploaded: void;
	}>();

	let title = '';
	let source = '';
	let essence = '';
	let conclusion = '';
	let status: '0' | '1' | '2' = '0';
	let file: File | null = null;

	let isSubmitting = false;
	let errorMessage = '';

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			file = target.files[0];
		} else {
			file = null;
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!title.trim()) {
			errorMessage = 'Title is required.';
			return;
		}

		if (!file) {
			errorMessage = 'Please select a document file to upload.';
			return;
		}

		isSubmitting = true;
		errorMessage = '';

		const formData = new FormData();
		formData.append('title', title.trim());
		formData.append('source', source.trim());
		formData.append('essence', essence.trim());
		formData.append('conclusion', conclusion.trim());
		formData.append('status', status);
		formData.append('file', file);

		try {
			const response = await fetch('/api/documents', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const text = await response.text();
				errorMessage = `Upload failed: ${text || response.statusText}`;
				return;
			}

			dispatch('uploaded');
			dispatch('close');
		} catch (error) {
			console.error('Error uploading document:', error);
			errorMessage = 'Unexpected error uploading document. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	function handleClose() {
		dispatch('close');
	}

	function handleCancelClick(event?: MouseEvent) {
		event?.preventDefault();
		handleClose();
	}
</script>

<div class="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
	<div class="relative flex h-[85vh] w-[70vw] flex-col rounded-2xl bg-light-primary p-6 shadow-xl">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-semibold">Upload Document</h2>
			<ButtonSvg type="close" size={8} onClick={handleClose} />
		</div>

		<form class="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto pr-2" onsubmit={handleSubmit}>
			<div class="grid grid-cols-2 gap-6">
				<label class="flex flex-col gap-2">
					<span class="text-sm font-medium text-light-text-secondary">Title *</span>
					<input
						class="rounded-lg border border-light-stroke bg-light-hovered-primary px-3 py-2 text-lg focus:border-dark-primary focus:outline-none"
						type="text"
						bind:value={title}
						required
						placeholder="Document title"
					/>
				</label>

				<label class="flex flex-col gap-2">
					<span class="text-sm font-medium text-light-text-secondary">Source</span>
					<input
						class="rounded-lg border border-light-stroke bg-light-hovered-primary px-3 py-2 text-lg focus:border-dark-primary focus:outline-none"
						type="text"
						bind:value={source}
						placeholder="e.g. Internal Report"
					/>
				</label>

				<label class="flex flex-col gap-2">
					<span class="text-sm font-medium text-light-text-secondary">Status</span>
					<select
						class="rounded-lg border border-light-stroke bg-light-hovered-primary px-3 py-2 text-lg focus:border-dark-primary focus:outline-none"
						bind:value={status}
					>
						<option value="0">Not started</option>
						<option value="1">In progress</option>
						<option value="2">Finished</option>
					</select>
				</label>

				<label class="flex flex-col gap-2">
					<span class="text-sm font-medium text-light-text-secondary">Document file *</span>
					<input
						class="rounded-lg border border-dashed border-light-stroke bg-light-hovered-primary px-3 py-2 text-base focus:border-dark-primary focus:outline-none"
						type="file"
						accept=".pdf,.doc,.docx,.txt,.md"
						onchange={handleFileChange}
					/>
					{#if file}
						<span class="text-xs text-light-text-secondary">Selected: {file.name}</span>
					{/if}
				</label>
			</div>

			<label class="flex flex-col gap-2">
				<span class="text-sm font-medium text-light-text-secondary">Essence</span>
				<textarea
					class="min-h-[8rem] rounded-lg border border-light-stroke bg-light-hovered-primary px-3 py-2 text-base focus:border-dark-primary focus:outline-none"
					bind:value={essence}
					placeholder="What is the essence of this document?"
				></textarea>
			</label>

			<label class="flex flex-col gap-2">
				<span class="text-sm font-medium text-light-text-secondary">Conclusion</span>
				<textarea
					class="min-h-[6rem] rounded-lg border border-light-stroke bg-light-hovered-primary px-3 py-2 text-base focus:border-dark-primary focus:outline-none"
					bind:value={conclusion}
					placeholder="Any conclusion or summary"
				></textarea>
			</label>

			{#if errorMessage}
				<div class="rounded-lg border border-red-400 bg-red-100 px-4 py-2 text-sm text-red-700">
					{errorMessage}
				</div>
			{/if}

			<div class="sticky bottom-0 mt-auto flex justify-end gap-4 pt-4">
				<ButtonText text="Cancel" onClick={handleCancelClick} />
				<ButtonText
					text={isSubmitting ? 'Uploading...' : 'Upload document'}
					disabled={isSubmitting}
					customClass={`px-6 ${isSubmitting ? 'opacity-70' : ''}`}
					type="submit"
				/>
			</div>
		</form>
	</div>
</div>
