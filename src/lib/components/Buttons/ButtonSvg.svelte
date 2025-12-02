<script lang="ts">
	import HomeIcon from '$lib/assets/home.svg';
	import EyeIcon from '$lib/assets/eye.svg';
	import EditIcon from '$lib/assets/edit.svg';
	import NodeIcon from '$lib/assets/node-editor.svg';
	import SaveIcon from '$lib/assets/save.svg';
	import TrashIcon from '$lib/assets/trashcan.svg';
	import MagnifyingGlassIcon from '$lib/assets/magnifying-glass.svg';
	import FilterIcon from '$lib/assets/filter.svg';
	import DropdownIcon from '$lib/assets/dropdown.svg';
    import CloudUploadIcon from '$lib/assets/cloud-upload.svg';
	import MoreOptions from '$lib/assets/three-dots-circle.svg';
	import CloseIcon from '$lib/assets/x.svg';
	import PlusIcon from '$lib/assets/plus.svg';

	interface Props {
		type?: string;
		size?: number;
		customClass?: string;
		onClick?: () => void;
		asChild?: boolean;
	}

	let {
		type = 'default',
		size = 8,
		customClass = '',
		onClick = () => {},
		asChild = false
	}: Props = $props();

	const iconMap: Record<string, string> = {
		home: HomeIcon,
		node: NodeIcon,
		save: SaveIcon,
		eye: EyeIcon,
		edit: EditIcon,
		trash: TrashIcon,
		search: MagnifyingGlassIcon,
		filter: FilterIcon,
		dropdown: DropdownIcon,
		default: HomeIcon,
		cloudUpload: CloudUploadIcon,
		moreOptions: MoreOptions,
		threeDots: MoreOptions,
		close: CloseIcon,
		plus: PlusIcon
	};

	const sizeMap: Record<number, string> = {
		4: 'h-4 w-4',
		6: 'h-6 w-6',
		8: 'h-8 w-8',
		10: 'h-10 w-10',
		12: 'h-12 w-12'
	};

	let iconSrc = $derived(iconMap[type] || iconMap['default']);
	let sizeClass = $derived(sizeMap[size] || 'h-8 w-8');
</script>

{#if asChild}
	<img src={iconSrc} alt={type} class={`${sizeClass} ${customClass}`} />
{:else}
	<button
		type="button"
		class={`p-0 border-none cursor-pointer ${customClass} hover:filter hover:brightness-200 transition duration-150`}
		onclick={onClick}
		aria-label={type}
	>
		<img src={iconSrc} alt={type} class={sizeClass} />
	</button>
{/if}
