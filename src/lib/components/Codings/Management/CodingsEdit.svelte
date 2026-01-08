<script lang="ts">
	import type { Coding } from '$lib/types';
	import ButtonText from '../../Buttons/ButtonText.svelte';
	import PopUp from '../../PopUps/PopUp.svelte';
	import CodingForm from './CodingForm.svelte';
	import { toastStore } from '../../PopUps/Toast/toastStore.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		coding: Coding | undefined;
		type: string;
		isCreateForm: boolean;
		onCodingDeleted: Function;
		onCreated?: () => void;
	}
	let { coding, type, onCodingDeleted, isCreateForm, onCreated }: Props = $props();

	let form = $state({
		id: -1,
		parent_id: null as number | null,
		name: '',
		description: '',
		number: 0
	});

	$effect(() => {
		if (coding) {
			form = {
				id: coding.id ?? -1,
				parent_id: coding.parent_id ?? null,
				name: coding.name ?? '',
				description: coding.description ?? '',
				number: coding.number ?? 0
			};
		} else {
			form = { id: -1, parent_id: null, name: '', description: '', number: 0 };
		}
	});

	let popUpOpen = $state(false);

	async function updateCoding(event: SubmitEvent) {
		event.preventDefault();
		if (!coding?.id) return;

		const response = await fetch(`/codings/${form.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...form, type: type.toLowerCase() })
		});

		if (response.ok) {
			toastStore.success('Coding updated successfully!');
			await invalidateAll();
		} else {
			toastStore.error('Failed to update coding');
		}
	}

	async function deleteCoding() {
		popUpOpen = false;
		if (!coding?.id) return;

		const response = await fetch(`/codings/${coding.id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type })
		});

		const responseBody = await response.text();

		if (response.ok) {
			toastStore.success(`"${coding.name}" deleted successfully`);
			onCodingDeleted(coding);
		} else {
			console.log('response body');
			toastStore.error(responseBody);
		}
	}
</script>

<div class="mt-10 flex h-full w-1/2 flex-col items-center self-center">
	{#if isCreateForm}
		<div class="w-full p-6">
			<h2 class="mb-6 text-2xl font-semibold text-gray-800">Create New Coding</h2>
		</div>
		<form
			action="?/codings"
			method="POST"
			class="flex w-full flex-col px-6"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						toastStore.success('Coding created successfully!');
						await invalidateAll();
						if (onCreated) onCreated();
					} else {
						toastStore.error('Failed to create coding');
					}
				};
			}}
		>
			<input type="hidden" name="type" value={type.toLowerCase()} />
			<input type="hidden" name="parent_id" value={form.parent_id ?? ''} />

			<CodingForm
				number={form.number}
				name={form.name}
				description={form.description}
				onNumberChange={(value) => (form.number = value)}
				onNameChange={(value) => (form.name = value)}
				onDescriptionChange={(value) => (form.description = value)}
			/>

			<div class="flex items-center justify-center gap-4">
				<ButtonText text="Submit" type="submit" />
			</div>
		</form>
	{:else if popUpOpen}
		<PopUp
			heading="Are you sure you want to delete this coding"
			question="This coding will be delted perenamently, do you want to delete it ? "
			onClose={() => (popUpOpen = false)}
			onYes={deleteCoding}
		/>
	{:else if coding != undefined}
		<div class="w-full p-6">
			<h2 class="mb-6 text-2xl font-semibold text-gray-800">Edit Coding</h2>
		</div>
		<form class="flex w-full flex-col px-6" onsubmit={updateCoding}>
			<input type="hidden" name="id" value={form.id} />

			<CodingForm
				number={form.number}
				name={form.name}
				description={form.description}
				onNumberChange={(value) => (form.number = value)}
				onNameChange={(value) => (form.name = value)}
				onDescriptionChange={(value) => (form.description = value)}
			/>

			<div class="flex items-center justify-center gap-4">
				<ButtonText text="Submit" type="submit" />
				<button type="button" onclick={() => (popUpOpen = !popUpOpen)}>
					<ButtonText text="Delete" customClass="bg-red-500 hover:bg-red-600" />
				</button>
			</div>
		</form>
	{:else}
		<div class="flex h-full w-full items-center justify-center">
			<div class="text-center text-gray-400">
				<p class="text-xl">Select a coding to view or edit</p>
				<p class="mt-2 text-sm">or click "Add" to create a new one</p>
			</div>
		</div>
	{/if}
</div>
