<script lang="ts">
    import ButtonSvg from "./ButtonSvg.svelte";

    export let label: string = "1";
    export let title: string = "Activity Name";
    export let customClass: string = "";

    export let buttonOnClick = () => {};
    export let buttonIcon: string = "moreOptions";
</script>

<div class="h-10 w-auto rounded-2xl flex items-center shadow-md/25  {customClass}">
    <p class="ml-2">{label}</p>
    <p class="flex-1 pl-2 font-medium text-light-text-primary">{title}</p>
    <ButtonSvg type={buttonIcon} size={6} customClass="mr-2 ml-auto" onClick={buttonOnClick}/>
</div>