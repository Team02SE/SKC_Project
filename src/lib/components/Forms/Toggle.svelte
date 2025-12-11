<script lang="ts">
	interface Props {
		labelOn: string;
		lebelOff: string;
		onToggle: Function;
	}

	let checked = $state(true);

	let { labelOn = 'Document', lebelOff = 'Metadata', onToggle }: Props = $props();

	function toggle() {
		checked = !checked;
		onToggle(checked);
	}
</script>

<div class="flex flex-col">
	<!-- Label above the toggle -->
	<span class="mb-1 w-20 text-center text-lg font-medium text-gray-700">
		{checked ? labelOn : lebelOff}
	</span>

	<!-- The toggle button -->
	<button
		type="button"
		class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none"
		class:bg-light-button-primary={!checked}
		class:bg-amber-500={checked}
		onclick={toggle}
		aria-pressed={checked}
		aria-label="Toggle switch"
	>
		<span
			class="inline-block h-5 w-5 transform rounded-full border border-zinc-200 bg-white shadow-xl transition duration-200 ease-in-out"
			class:translate-x-7={checked}
			class:translate-x-0={!checked}
		></span>
	</button>
</div>
