<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ButtonSvg from '../Buttons/ButtonSvg.svelte';
	import ButtonText from '../Buttons/ButtonText.svelte';

	const dispatch = createEventDispatcher<{
		close: void;
		uploaded: void;
	}>();

	let documentType: string = 'report';
	let files: File[] = [];

	let isSubmitting = false;
	let errorMessage = '';

	const documentTypeOptions = [
		{ value: 'report', label: 'Report' },
		{ value: 'article', label: 'Article' },
		{ value: 'policy', label: 'Policy' },
		{ value: 'memo', label: 'Memo' },
		{ value: 'other', label: 'Other' }
	];

	function addFiles(fileList: FileList) {
		if (fileList.length > 0) {
			const newFiles = Array.from(fileList);
			const existingNames = new Set(files.map((f) => f.name + f.size + f.lastModified));
			const deduped = newFiles.filter(
				(file) => !existingNames.has(file.name + file.size + file.lastModified)
			);
			files = [...files, ...deduped];
		}
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			addFiles(target.files);
			target.value = '';
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (files.length === 0) {
			errorMessage = 'Please select at least one document to upload.';
			return;
		}

		isSubmitting = true;
		errorMessage = '';

		try {
			for (const file of files) {
				const derivedTitle =
					file?.name?.replace(/\.[^/.]+$/, '').trim() || `Document ${Date.now()}`;

				const formData = new FormData();
				formData.append('Title', derivedTitle);
				formData.append('Source', '');
				formData.append('Essence', '');
				formData.append('Conclusion', '');
				formData.append('Status', '0');
				formData.append('documentType', documentType);
				formData.append('file', file);

				const response = await fetch('/api/documents', {
					method: 'POST',
					body: formData
				});

				if (!response.ok) {
					const text = await response.text();
					errorMessage = `Upload failed for ${file.name}: ${text || response.statusText}`;
					return;
				}
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

	function selectDocumentType(value: string) {
		documentType = value;
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}
</script>

<div class="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
	<div
		class="relative flex h-auto w-[80vw] max-w-5xl flex-col rounded-2xl bg-light-primary p-6 shadow-xl"
	>
		<div class="border-light-stroke flex items-center justify-between border-b pb-4">
			<div>
				<h2 class="text-3xl font-semibold text-light-text-primary">Upload a document</h2>
			</div>
			<ButtonSvg type="close" size={8} onClick={handleClose} />
		</div>

		<form class="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto pr-2" onsubmit={handleSubmit}>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<section
					class="border-light-stroke flex flex-col gap-4 rounded-2xl border border-dashed bg-light-hovered-primary/50 px-6 py-8 text-center"
				>
					<p class="text-base font-medium text-light-text-primary">
						Choose or drag and drop your document
					</p>
					<label
						class="border-light-stroke hover:border-dark-primary mx-auto flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border bg-light-primary px-4 py-6 text-sm font-semibold text-light-text-primary transition hover:bg-light-hovered-primary"
						ondragover={(event) => event.preventDefault()}
						ondrop={(event) => {
							event.preventDefault();
							const droppedFiles = event.dataTransfer?.files;
							if (droppedFiles) {
								addFiles(droppedFiles);
							}
						}}
					>
						<input
							class="hidden"
							type="file"
							multiple
							accept=".pdf,.doc,.docx,.txt,.md"
							onchange={handleFileChange}
							required
						/>
						<ButtonSvg type="cloudUpload" size={10} />
						<span>{files.length > 0 ? 'Add more documents' : 'Select documents'}</span>
						<span class="text-light-text-secondary text-xs font-normal"
							>PDF, Word, or plain text up to 25 MB each</span
						>
					</label>

					{#if files.length > 0}
						<div
							class="flex max-h-56 flex-col gap-3 overflow-y-auto rounded-xl bg-light-primary/70 p-4 text-left text-sm"
						>
							{#each files as file, index}
								<div
									class="border-light-stroke flex items-center justify-between rounded-lg border bg-light-hovered-primary px-3 py-2"
								>
									<div class="flex flex-col">
										<p class="font-semibold text-light-text-primary">{file.name}</p>
										<p class="text-light-text-secondary text-xs">
											{(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || 'Unknown type'}
										</p>
									</div>
									<button
										type="button"
										class="text-light-text-secondary rounded-full border border-transparent p-2"
										onclick={() => removeFile(index)}
										aria-label={`Remove ${file.name}`}
									>
										<ButtonSvg type="close" size={6} />
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</section>

				<section
					class="border-light-stroke flex flex-col gap-4 rounded-2xl border bg-light-primary/80 px-6 py-6"
				>
					<p class="text-base font-medium text-light-text-primary">
						What kind of document is this?
					</p>
					<div class="flex flex-col gap-3">
						{#each documentTypeOptions as option}
							<button
								type="button"
								class={`flex flex-col rounded-xl border px-4 py-3 text-left transition ${
									documentType === option.value
										? 'border-dark-primary bg-dark-primary/10 text-dark-primary'
										: 'border-light-stroke hover:border-dark-primary/60 hover:text-dark-primary bg-light-hovered-primary text-light-text-primary'
								}`}
								onclick={() => selectDocumentType(option.value)}
							>
								<span class="text-sm font-semibold">{option.label}</span>
							</button>
						{/each}
					</div>
				</section>
			</div>

			{#if errorMessage}
				<div class="rounded-lg border border-red-400 bg-red-100 px-4 py-2 text-sm text-red-700">
					{errorMessage}
				</div>
			{/if}

			<div class="sticky bottom-0 mt-auto flex justify-end gap-4 pt-4">
				<ButtonText text="Cancel" onClick={handleCancelClick} />
				<ButtonText
					onClick={(e) => {
						e?.preventDefault();
						handleSubmit(e as Event);
					}}
					text={isSubmitting ? 'Uploading...' : 'Upload document'}
					disabled={isSubmitting}
					customClass={`px-6 ${isSubmitting ? 'opacity-70' : ''}`}
					type="submit"
				/>
			</div>
		</form>
	</div>
</div>
