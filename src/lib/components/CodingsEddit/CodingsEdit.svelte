<script lang="ts">
	import type { Coding } from '$lib/types';
	import InputText from '$lib/components/Forms/InputText.svelte';
	import edit_pencil from '$lib/assets/edit-pencil.svg';
	import { slide } from 'svelte/transition';
	import ButtonText from '../ButtonText.svelte';
	import PopUp from '../PopUps/PopUp.svelte';
	import { invalidateAll, refreshAll } from '$app/navigation';
	import { page } from '$app/state';

	interface Props {
		coding: Coding | undefined;
		type: string;
		isCreateForm : boolean; 
		onCodingDeleted: Function;
		onCreated?: () => void;
	}
	let { coding, type, onCodingDeleted, isCreateForm, onCreated }: Props = $props();

	let form = $state({
		id: -1 as number,
		parent_id: null as number | null,
		name: '' as string,
		description: '' as string,
		number: 0 as number
	});

	$effect(() => {
		if (coding) {
			form.id = coding.id ?? -1;
			form.parent_id = coding.parent_id ?? null;
			form.name = coding.name ?? '';
			form.description = coding.description ?? '';
			form.number = coding.number ?? 0;
		} else {
			form.id = -1;
			form.parent_id = null;
			form.name = '';
			form.description = '';
			form.number = 0;
		}
	});

	let popUpOpen = $state(false);

	let codingCopy = $derived(coding);

	async function updateCoding(event: SubmitEvent) {
		event.preventDefault();

		if (!form.id || form.id === -1) {
			console.error('No valid ID available for update');
			return;
		}

		const payload = {
			...form,
			type: type.toLowerCase()
		};

		const response = await fetch(`/codings/${form.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!response.ok) console.error('Update failed');
		else console.log('Update successful');
	}

	async function deleteCoding() {
		popUpOpen = false;

		if (!coding?.id) {
			console.error('No coding selected for deletion');
			return;
		}

		const response = await fetch(`/codings/${coding.id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type })
		});

		if (!response.ok) console.error('Delete failed');
		else {
			onCodingDeleted(coding);
			console.log('Delete successful');
		}
	}
</script>

<div class="mt-10 flex h-full w-1/2 flex-col items-center self-center">
	{#if isCreateForm}
	<form
		transition:slide
		action="?/codings"
		method="POST"
		class="flex h-full w-full flex-col items-center"
	>
		<input type="hidden" name="type" value={type.toLowerCase()} />
		<input type="hidden" name="parent_id" value={form.parent_id ?? ''} />
		<input type="hidden" name="number" value={form.number} />

		<div class="flex flex-row items-center self-center">
			<div class="flex flex-col items-center gap-2">
				<label class="text-sm font-medium text-gray-700">
					<input
						type="text"
						name="name"
						class="w-full border-x-0 border-t-0 border-b-2 border-black bg-transparent px-3 py-2 text-center text-4xl font-bold
						opacity-55 duration-300 focus:opacity-95
						disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
						bind:value={form.name}
					/>
				</label>
			</div>
			<img alt="edit" class="h-10 w-10" src={edit_pencil} />
		</div>

		<div class="mt-10 flex w-full flex-col items-center">
			<div class="flex w-full flex-row justify-between">
				<label class="w-full text-xl font-medium text-gray-700">
					Description:
					<textarea
						name="description"
						class="h-full w-full rounded-md wrap-normal opacity-70 shadow-md duration-200 focus:opacity-95"
						bind:value={form.description}
					></textarea>
				</label>
			</div>

			<div class="mt-10 w-full">
				<div class="flex w-full flex-row justify-between">
					<label class="w-full text-xl font-medium text-gray-700">
						Number:
						<input
							class="w-full rounded-md wrap-normal opacity-70 duration-200 focus:opacity-95"
							type="number"
							name="number_display"
							bind:value={form.number}
						/>
					</label>
				</div>
			</div>
			<div class="align-center flex items-center gap-4">
			<div class="mt-4">
				<ButtonText text="Submit" />
			</div>
		</div>
		</div>
	</form>
	{:else}
	{#if popUpOpen}
	<PopUp
	heading="Are you sure you want to delete this coding"
	question="This coding will be delted perenamently, do you want to delete it ? "
	onClose={() => (popUpOpen = false)}
	onYes={deleteCoding}
	/>
{:else if coding != undefined}
	<form
		transition:slide
		class="flex h-full w-full flex-col items-center"
		onsubmit={updateCoding}
	>
		<input type="hidden" name="id" value={form.id} />

		<div class="flex flex-row items-center self-center">
			<div class="flex flex-col items-center gap-2">
				<label class="text-sm font-medium text-gray-700">
					<input
						type="text"
						name="name"
						class="w-full border-x-0 border-t-0 border-b-2 border-black bg-transparent px-3 py-2 text-center text-4xl font-bold
						opacity-55 duration-300 focus:opacity-95
						disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
						bind:value={form.name}
					/>
				</label>
			</div>
			<img alt="edit" class="h-10 w-10" src={edit_pencil} />
		</div>

		<div class="mt-10 flex w-full flex-col items-center">
			<div class="flex w-full flex-row justify-between">
				<label class="w-full text-xl font-medium text-gray-700">
					Description:
					<textarea
						name="description"
						class="h-full w-full rounded-md wrap-normal opacity-70 shadow-md duration-200 focus:opacity-95"
						bind:value={form.description}
					></textarea>
				</label>
			</div>

			<div class="mt-10 w-full">
				<div class="flex w-full flex-row justify-between">
					<label class="w-full text-xl font-medium text-gray-700">
						Number:
						<input
							class="w-full rounded-md wrap-normal opacity-70 duration-200 focus:opacity-95"
							type="number"
							name="number"
							bind:value={form.number}
						/>
					</label>
				</div>
			</div>
		</div>

		<div class="align-center flex items-center gap-4">
			<div class="mt-4">
				<ButtonText text="Submit" />
			</div>
		</div>
	</form>
<!-- Temp delete button -->
<button type="button" onclick={() => (popUpOpen = !popUpOpen)} class="absolute bottom-4">
	<ButtonText text="Delete" customClass="bg-red-500" />
</button>
{:else}
<h1>Select activity</h1>
{/if}
{/if}
</div>
