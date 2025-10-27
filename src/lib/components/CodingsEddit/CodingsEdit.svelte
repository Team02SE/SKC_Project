<script lang="ts">
	import type { Coding } from '$lib/types';
	import InputText from '$lib/components/Forms/InputText.svelte';
	import edit_pencil from '$lib/assets/edit-pencil.svg';
	import { slide } from 'svelte/transition';

	interface Props {
		coding: Coding | undefined;
	}
	let { coding }: Props = $props();

	let codingCopy = $derived(coding);
</script>

<div class="flex h-full w-1/2 flex-col items-center self-center">
	{#if coding != undefined}
		<form transition:slide class="g-10 flex h-full w-full flex-col items-center gap-10">
			<div class="flex flex-row items-center self-center">
				<div class="flex flex-col items-center gap-2">
					<label for={codingCopy?.name} class="text-sm font-medium text-gray-700"> </label>
					<input
						type="text"
						name="name"
						class=" w-full border-x-0 border-t-0 border-b-2 border-black bg-transparent px-3 py-2 text-center text-4xl font-bold
						opacity-55 duration-300 focus:opacity-95
						disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
						bind:value={codingCopy.name}
					/>
				</div>
				<img alt="edit" class="h-10 w-10" src={edit_pencil} />
			</div>

			<div class="flex w-full flex-col items-center">
				<div class="flex w-full flex-row justify-between">
					<label for={codingCopy?.description} class="text-2xl font-medium text-gray-700">
						Description:
					</label>
					<img alt="edit" class="h-10 w-10" src={edit_pencil} />
				</div>
				<div class="h-1/3 w-full">
					<div class="items-ceter flex h-full flex-row">
						<textarea
							name="descriptipn"
							class="h-full w-full wrap-normal"
							bind:value={coding.description}
						></textarea>
					</div>
				</div>
				<div class="w-full">
					<div class="flex w-full flex-row justify-between">
						<label for={codingCopy?.description} class="text-2xl font-medium text-gray-700">
							Description:
						</label>
						<img alt="edit" class="h-10 w-10" src={edit_pencil} />
					</div>
					<input class="w-full" type="number" bind:value={coding.number} />
				</div>
			</div>
		</form>
	{:else}
		<h1>Select activity</h1>
	{/if}
</div>
