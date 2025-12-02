<script lang="ts">
	export let text = "Button";
	export let customClass = "";
	export let onClick: (event?: MouseEvent) => void = () => {};
	export let type: "button" | "submit" | "reset" = "button";
	export let disabled = false;
</script>

<button {type} {disabled} class={`bg-light-active-primary px-6 py-2.5 rounded-lg text-base text-light-primary font-semibold shadow-sm hover:shadow-md hover:brightness-110 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:brightness-100 ${customClass}`} on:click={onClick}>
    {text}
</button>