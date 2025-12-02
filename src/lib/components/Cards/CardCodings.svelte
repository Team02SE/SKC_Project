<script lang="ts">
	import ButtonSvg from '../Buttons/ButtonSvg.svelte';
	import DropdownList from '../DropdownList/DropdownList.svelte';

	interface Props {
		label?: string;
		title?: string;
		customClass?: string;
		isNew?: boolean;
		isDeleted?: boolean;
		buttonIcon?: string;
		type?:
			| 'activities'
			| 'effects'
			| 'opportunity-structures'
			| 'system-vulnerabilities'
			| 'destep';
		codingId?: number;
		hasDeletedAncestor?: boolean;
		onAddSubRequest?: (parentId: number) => void;
		onDeleteRequest?: (codingId: number) => void;
		onCancelRequest?: (codingId: number) => void;
	}

	let {
		label = '1',
		title = 'Activity Name',
		customClass = '',
		isNew = false,
		isDeleted = false,
		buttonIcon = 'moreOptions',
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

	let buttonOnClick = (e?: MouseEvent) => {
		if (e) {
			e.stopPropagation();
		}
		if (isButtonDisabled) return;
		if (isDeleted) {
			handleCancel();
		} else {
			showDropdown = !showDropdown;
		}
	};

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

	// Build menu items based on state
	let menuItems = $derived(
		isNew
			? [
					{ label: `Add sub-${type}`, onClick: handleAddSub },
					{ label: 'Cancel', onClick: handleCancel }
				]
			: [
					{ label: `Add sub-${type}`, onClick: handleAddSub },
					{ label: 'Delete', onClick: handleDelete, className: 'text-red-600' }
				]
	);
</script>

<div
	class="relative flex h-10 w-auto items-center rounded-2xl shadow-md/25 {isNew
		? 'border-2 border-green-300 bg-green-100'
		: isDeleted
			? 'border-2 border-red-300 bg-red-100'
			: ''} {customClass}"
>
	<p class="ml-2">{label}</p>
	<p class="flex-1 pl-2 font-medium text-light-text-primary">{title}</p>
	<div class="relative">
		<ButtonSvg
			type={currentIcon}
			size={6}
			customClass="mr-2 ml-auto {isButtonDisabled ? 'opacity-30 cursor-not-allowed' : ''}"
			onClick={buttonOnClick}
		/>
		{#if showDropdown}
			<DropdownList
				menuItems={menuItems}
				position="center"
				onClose={() => (showDropdown = false)}
			/>
		{/if}
	</div>
</div>
