<script lang="ts">
	import ButtonSvg from '../Buttons/ButtonSvg.svelte';
	import DropdownList from '../DropdownList/DropdownList.svelte';
	import { dropdownState } from '$lib/utils/dropdownState.svelte';
	import type { CodingData } from '../Codings/Management/TreeCodings.svelte';

	interface Props {
		label?: string;
		title?: string;
		customClass?: string;
		isNew?: boolean;
		isDeleted?: boolean;
		buttonIcon?: string;
		reasoning?: string;
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
		onAddReasonRequest?: (codingId: number, reason: string) => void;
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
		reasoning = 'no reson',
		onAddSubRequest = undefined,
		onDeleteRequest = undefined,
		onCancelRequest = undefined,
		onAddReasonRequest = undefined
	}: Props = $props();

	let dropdownId = $derived(`card-${type}-${codingId ?? Math.random()}`);
	let showDropdown = $derived(dropdownState.isOpen(dropdownId));

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
			dropdownState.toggle(dropdownId);
		}
	};

	function handleAddSub() {
		if (codingId !== undefined && onAddSubRequest) {
			onAddSubRequest(codingId);
		}
		dropdownState.close(dropdownId);
	}

	function handleDelete() {
		if (codingId !== undefined && onDeleteRequest) {
			onDeleteRequest(codingId);
		}
		dropdownState.close(dropdownId);
	}

	function handleCancel() {
		if (codingId !== undefined && onCancelRequest) {
			onCancelRequest(codingId);
		}
		dropdownState.close(dropdownId);
	}

	function handleAddReason() {
		if (reasoning !== undefined && onAddReasonRequest && codingId) {
			onAddReasonRequest(codingId, reasoning);
		}
		dropdownState.close(dropdownId);
	}

	// Build menu items based on state
	let menuItems = $derived(
		isNew
			? [
					{ label: `Add sub-${type}`, onClick: handleAddSub },
					{ label: 'Add reason', onClick: handleAddReason },
					{ label: 'Cancel', onClick: handleCancel }
				]
			: [
					{ label: `Add sub-${type}`, onClick: handleAddSub },
					{ label: 'Add reason', onClick: handleAddReason },
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
	<div class="flex-1 flex-col pl-2">
		<p class=" font-medium text-light-text-primary">{title}</p>
		<p class="mt-[-5px] ml-1 text-xs text-light-text-primary opacity-45">{reasoning}</p>
	</div>

	<div class="relative">
		<ButtonSvg
			type={currentIcon}
			size={6}
			customClass="mr-2 ml-auto {isButtonDisabled ? 'opacity-30 cursor-not-allowed' : ''}"
			onClick={buttonOnClick}
		/>
		{#if showDropdown}
			<DropdownList
				{menuItems}
				position="center"
				onClose={() => dropdownState.close(dropdownId)}
				customClass="w-45"
			/>
		{/if}
	</div>
</div>
