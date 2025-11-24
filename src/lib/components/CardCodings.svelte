<script lang="ts">
    import ButtonSvg from "./ButtonSvg.svelte";

    export let label: string = "1";
    export let title: string = "Activity Name";
    export let customClass: string = "";
    export let isNew: boolean = false;
    export let showDropdown: boolean = false;

    export let buttonIcon: string = "moreOptions";
    export let type: 'activities' | 'effects' | 'opportunity-structures' | 'system-vulnerabilities' | 'dsteps' = 'activities';
    export let codingId: number | undefined = undefined;
    export let onAddSubRequest: ((parentId: number) => void) | undefined = undefined;

    let buttonOnClick = () => {
        showDropdown = !showDropdown;
    };

    
    function handleEdit() {
        // Handle edit action
    }

    function handleAddSub() {
        console.log("Adding sub-" + type);
        if (codingId !== undefined && onAddSubRequest) {
            onAddSubRequest(codingId);
        }
        showDropdown = false;
    }

    function handleDelete() {
        // Handle delete action
    }
</script>

<div class="relative h-10 w-auto rounded-2xl flex items-center shadow-md/25 {isNew ? 'bg-green-100 border-2 border-green-300' : ''} {customClass}">
    <p class="ml-2">{label}</p>
    <p class="flex-1 pl-2 font-medium text-light-text-primary">{title}</p>
    <div class="relative">
        <ButtonSvg type={buttonIcon} size={6} customClass="mr-2 ml-auto" onClick={buttonOnClick}/>
        {#if showDropdown}
            <div class="absolute bg-white rounded-2xl shadow-lg p-2 z-10 left-1/2 -translate-x-1/2 w-40">
                <button class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer w-full">Edit</button>
                <button class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer w-full" onclick={handleAddSub}>Add sub-{type}</button>
                <button class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer w-full">Delete</button>
            </div>
        {/if}
    </div>
</div>