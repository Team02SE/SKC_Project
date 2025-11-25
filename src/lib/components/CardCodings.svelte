<script lang="ts">
    import ButtonSvg from "./ButtonSvg.svelte";

    interface Props {
        label?: string;
        title?: string;
        customClass?: string;
        isNew?: boolean;
        isDeleted?: boolean;
        buttonIcon?: string;
        type?: 'activities' | 'effects' | 'opportunity-structures' | 'system-vulnerabilities' | 'dsteps';
        codingId?: number;
        hasDeletedAncestor?: boolean;
        onAddSubRequest?: (parentId: number) => void;
        onDeleteRequest?: (codingId: number) => void;
        onCancelRequest?: (codingId: number) => void;
    }

    let {
        label = "1",
        title = "Activity Name",
        customClass = "",
        isNew = false,
        isDeleted = false,
        buttonIcon = "moreOptions",
        type = 'activities',
        codingId = undefined,
        hasDeletedAncestor = false,
        onAddSubRequest = undefined,
        onDeleteRequest = undefined,
        onCancelRequest = undefined
    }: Props = $props();

    let showDropdown: boolean = $state(false);

    let isPending = $derived(isNew || isDeleted);
    let currentIcon = $derived(isDeleted ? 'close' : isNew ? 'moreOptions' : buttonIcon);

    let isButtonDisabled = $derived(hasDeletedAncestor && isDeleted);

    let buttonOnClick = () => {
        if (isButtonDisabled) return;
        if (isDeleted) {
            handleCancel();
        } else {
            showDropdown = !showDropdown;
        }
    };

    
    function handleEdit() {
        // Handle edit action
    }

    function handleAddSub() {
        
        if (codingId !== undefined && onAddSubRequest) {
            onAddSubRequest(codingId);
        }
        showDropdown = false;
    }

    function handleDelete() {
        if (codingId !== undefined && onDeleteRequest) {
            onDeleteRequest(codingId);
        }
        showDropdown = false;
    }

    function handleCancel() {
        if (codingId !== undefined && onCancelRequest) {
            onCancelRequest(codingId);
        }
        showDropdown = false;
    }
</script>

<div class="relative h-10 w-auto rounded-2xl flex items-center shadow-md/25 {isNew ? 'bg-green-100 border-2 border-green-300' : isDeleted ? 'bg-red-100 border-2 border-red-300' : ''} {customClass}">
    <p class="ml-2">{label}</p>
    <p class="flex-1 pl-2 font-medium text-light-text-primary">{title}</p>
    <div class="relative">
        <ButtonSvg 
            type={currentIcon} 
            size={6}
            customClass="mr-2 ml-auto {isButtonDisabled ? 'opacity-30 cursor-not-allowed' : ''}" 
            onClick={buttonOnClick}
        />
        {#if showDropdown && isNew}
            <div class="absolute bg-white rounded-2xl shadow-lg p-2 z-10 left-1/2 -translate-x-1/2 w-40">
                <button class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer w-full" onclick={handleAddSub}>Add sub-{type}</button>
                <button class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer w-full" onclick={handleCancel}>Cancel</button>
            </div>
        {:else if showDropdown && !isPending}
            <div class="absolute bg-white rounded-2xl shadow-lg p-2 z-10 left-1/2 -translate-x-1/2 w-40">
                <button class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer w-full">Edit</button>
                <button class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer w-full" onclick={handleAddSub}>Add sub-{type}</button>
                <button class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer w-full" onclick={handleDelete}>Delete</button>
            </div>
        {/if}
    </div>
</div>