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

	export let type: string = 'default';
	export let size: number = 8;
	export let customClass: string = '';

	export let onClick = () => {};

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
		close: CloseIcon
	};

	const sizeMap: Record<number, string> = {
		4: 'h-4 w-4',
		6: 'h-6 w-6',
		8: 'h-8 w-8',
		10: 'h-10 w-10',
		12: 'h-12 w-12'
	};

	const iconSrc = iconMap[type] || iconMap['default'];
	const sizeClass = sizeMap[size] || 'h-8 w-8';
</script>

<button
	type="button"
	class={`p-0 border-none bg-transparent cursor-pointer ${customClass} hover:filter hover:brightness-200 transition duration-150`}
	on:click={onClick}
	aria-label={type}
>
	<img src={iconSrc} alt={type} class={sizeClass} />
</button>
