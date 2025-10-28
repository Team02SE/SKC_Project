<script lang="ts">
	import type { Coding } from '$lib/types';
	import InputText from '$lib/components/Forms/InputText.svelte';
	import edit_pencil from '$lib/assets/edit-pencil.svg';
	import { slide } from 'svelte/transition';
	import ButtonText from '../ButtonText.svelte';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		coding: Coding | undefined;
		type: string;
	}
	let { coding, type }: Props = $props();

	let codingCopy = $derived(coding);

	const dispatch = createEventDispatcher();

	async function updateCoding(event: SubmitEvent) {
		event.preventDefault();
		if (!codingCopy?.id) {
			console.error("No ID available for update");
			return;
		}

		codingCopy.type = type.toLowerCase();
		const response = await fetch(`/codings/${codingCopy.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(codingCopy)
		});

		if (!response.ok) console.error('Update failed');
		else console.log('Update successful');
	}

	async function deleteCoding() {
		const ok = window.confirm('Are you sure you want to delete this coding?');
		if (!ok) return;

		const response = await fetch(`/codings/${codingCopy.id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type })
		});

		if (!response.ok) console.warn('Delete failed');
		else console.log('Delete successful');
		
		dispatch('deleted', { id: codingCopy?.id });
	}
</script>

<div class="mt-10 flex h-full w-1/2 flex-col items-center self-center">
	{#if coding != undefined}
		<form
			transition:slide
			class="flex h-full w-full flex-col items-center"
			onsubmit={updateCoding}
		>
			<label for={codingCopy?.id.toString()} class="hidden">
				<input name="id" type="number" bind:value={coding.id} />
			</label>
			<div class="flex flex-row items-center self-center">
				<div class="flex flex-col items-center gap-2">
					<label for={codingCopy?.name} class="text-sm font-medium text-gray-700">
						<input
							type="text"
							name="name"
							class="w-full border-x-0 border-t-0 border-b-2 border-black bg-transparent px-3 py-2 text-center text-4xl font-bold
							opacity-55 duration-300 focus:opacity-95
							disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
							bind:value={codingCopy!.name}
						/>
					</label>
				</div>
				<img alt="edit" class="h-10 w-10" src={edit_pencil} />
			</div>

			<div class="mt-10 flex w-full flex-col items-center">
				<div class="flex w-full flex-row justify-between">
					<label for={codingCopy?.description} class="w-full text-xl font-medium text-gray-700">
						Description:
						<textarea
							name="description"
							class="h-full w-full rounded-md wrap-normal opacity-70 shadow-md duration-200 focus:opacity-95"
							bind:value={coding.description}
						></textarea>
					</label>
				</div>

				<div class="mt-10 w-full">
					<div class="flex w-full flex-row justify-between">
						<label for={codingCopy?.number?.toString()} class="w-full text-xl font-medium text-gray-700">
							Number:
							<input
								class="w-full rounded-md wrap-normal opacity-70 duration-200 focus:opacity-95"
								type="number"
								bind:value={coding.number}
							/>
						</label>
					</div>
				</div>
			</div>
			<div class="flex items-center align-center gap-4">
				<div class="mt-4">
					<ButtonText text="Submit" />
				</div>
			</div>
		</form>
		<!-- Temp delete button -->
		<button type="button" onclick={deleteCoding} class="absolute bottom-4">
			<ButtonText text="Delete" customClass="bg-red-500"/>
		</button>
	{:else}
		<h1>Select activity</h1>
	{/if}
</div>