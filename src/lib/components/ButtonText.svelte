<script lang="ts">
	export let text = "Button";
	export let customClass = "";
	export let onClick: (event?: MouseEvent) => void = () => {};
	export let type: "button" | "submit" | "reset" = "button";
	export let disabled = false;
</script>

<button type="submit" class={`bg-light-active-primary p-2 inset-shadow-sm/25 rounded-2xl text-2xl text-light-primary font-semibold hover:brightness-125 ${customClass}`} on:click={onClick}>
    {text}
</button>