<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ButtonSvg from './ButtonSvg.svelte';

	const dispatch = createEventDispatcher<{ search: string }>();

	let query = '';

	function sendSearch(value: string) {
		const normalized = value.trim();
		dispatch('search', normalized);
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		query = target.value;
		sendSearch(query);
	}

	function handleSubmit() {
		sendSearch(query);
	}
</script>

<form
	class="flex h-full w-auto items-center rounded-4xl bg-light-primary inset-shadow-sm/25"
	role="search"
	on:submit|preventDefault={handleSubmit}
>
	<label class="sr-only" for="document-search">Search documents</label>
	<input
		id="document-search"
		name="document-search"
		type="text"
		placeholder="Search..."
		bind:value={query}
		on:input={handleInput}
		class="flex-1 rounded-4xl border-0 bg-transparent px-5 text-lg text-light-text-primary placeholder-light-text-primary/50 outline-none"
		autocomplete="off"
	/>
	<ButtonSvg type="search" customClass="p-1 mr-2" onClick={handleSubmit} />
</form>
