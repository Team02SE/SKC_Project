<script lang="ts">
	import HomeIcon from '$lib/assets/home.svg';
	import EyeIcon from '$lib/assets/eye.svg';
	import EditIcon from '$lib/assets/edit.svg';
	import TrashIcon from '$lib/assets/trashcan.svg';
	import MagnifyingGlassIcon from '$lib/assets/magnifying-glass.svg';
	import FilterIcon from '$lib/assets/filter.svg';
	import DropdownIcon from '$lib/assets/dropdown.svg';

	export let type:
		| 'default'
		| 'home'
		| 'eye'
		| 'edit'
		| 'trash'
		| 'search'
		| 'filter'
		| 'dropdown'
		= 'default';
	export let size: number = 8;
	export let customClass: string = '';

	const iconMap: Record<string, string> = {
		home: HomeIcon,
		eye: EyeIcon,
		edit: EditIcon,
		trash: TrashIcon,
		search: MagnifyingGlassIcon,
		filter: FilterIcon,
		dropdown: DropdownIcon,
		default: HomeIcon
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

<img src={iconSrc} alt={type} class={`${sizeClass} ${customClass}`} />
