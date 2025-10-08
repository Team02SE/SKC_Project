<script lang="ts">
	import ButtonSvg from './ButtonSvg.svelte';
	import ButtonText from './ButtonText.svelte';

	export let customClass: string = '';

	export let buttonOnClick = () => {};
</script>

<div class={`flex flex-col gap-2 ${customClass}`}>
	<div class="flex h-10 w-auto items-center rounded-2xl shadow-md/25 {customClass}">
		<p class="flex-1 pl-2 font-medium text-light-text-primary/50">Select...</p>
		<ButtonSvg type="dropdown" size={6} customClass="mr-2 ml-auto" onClick={buttonOnClick} />
	</div>
	<div class="flex justify-end">
		<ButtonText
			text="Add"
			customClass="text-sm bg-light-button-primary rounded-md w-16"
			onClick={buttonOnClick}
		/>
	</div>
</div>

<div>
	<h3 class="mb-2 text-lg font-semibold text-light-text-primary">Name</h3>
	<input
		type="text"
		placeholder="Search..."
		class="h-10 w-full rounded-2xl border-0 bg-transparent px-5 text-lg text-light-text-primary placeholder-light-text-primary/50 shadow-md/25 outline-none"
	/>
	<h3 class="mt-4 mb-2 text-lg font-semibold text-light-text-primary">Description</h3>
	<textarea
		placeholder="Search..."
		class="min-h-[120px] w-full resize-none rounded-2xl border-0 bg-transparent px-5 py-3 text-lg text-light-text-primary placeholder-light-text-primary/50 shadow-md/25 outline-none"
	></textarea>
    <div class="flex justify-end">
		<ButtonText
			text="Add"
			customClass="text-sm bg-light-button-primary rounded-md w-16"
			onClick={buttonOnClick}
		/>
	</div>
</div>
