<script>
    export let text = "Button";
    export let customClass = "";
    export let onClick = () => {};
</script>

<button class={`bg-light-active-primary p-2 inset-shadow-sm/25 rounded-2xl text-2xl text-light-primary font-semibold ${customClass}`} on:click={onClick}>
    {text}
</button>