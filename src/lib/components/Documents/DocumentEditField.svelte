<script lang="ts">
	import ButtonText from '../Buttons/ButtonText.svelte';

	let isEditing = $state(false);

	interface Props {
		label: string;
		value: string;
		allowEdit: Boolean;
	}

	let { label, value, allowEdit: allowEddit = false }: Props = $props();

	const unchangedValue = value;

	function onSave() {
		isEditing = false;
	}

	function onCancle() {
		console.log('canceling');
		isEditing = false;
		value = unchangedValue;
	}
</script>

<div class="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm">
	<p class="text-xs tracking-wide text-gray-500 uppercase">{label}</p>
	{#if isEditing}
		<div class="flex w-full flex-col items-start">
			<input class="h-full w-full rounded-xl bg-slate-100 shadow-lg" bind:value />
			<div class="mt-2 flex flex-row items-center">
				<ButtonText text="Save" onClick={onSave} />
				<button
					class="z-99 cursor-pointer p-2 text-sm text-red-500 duration-150 hover:underline"
					onclick={onCancle}>Cancel</button
				>
			</div>
		</div>
	{:else}
		<p class="text-lg font-medium text-gray-900">{value}</p>
	{/if}
	{#if allowEddit && !isEditing}
		<button
			onclick={() => {
				isEditing = true;
			}}
			class="underline opacity-50">Edit</button
		>
	{/if}
</div>
