<script lang="ts">
	export let checked = false;
	export let labelOn = 'Document';
	export let labelOff = 'Metadata';

	function toggle() {
		checked = !checked;
	}
</script>

<div class="flex flex-col items-center">
	<!-- Label above the toggle -->
	<span class="mb-1 w-20 text-center text-xs font-medium text-gray-700">
		{checked ? labelOn : labelOff}
	</span>

	<!-- The toggle button -->
	<button
		type="button"
		class="relative inline-flex h-4 w-11 items-center rounded-full ring-1 ring-gray-500 ring-offset-1 transition-colors duration-200 ease-in-out focus:outline-none"
		class:bg-gray-200={!checked}
		class:bg-gray-500={checked}
		on:click={toggle}
		aria-pressed={checked}
		aria-label="Toggle switch"
	>
		<span
			class="inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out"
			class:translate-x-7={checked}
			class:translate-x-0={!checked}
		></span>
	</button>
</div>