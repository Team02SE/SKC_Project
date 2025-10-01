<script lang="ts">
	import HomeIcon from '$lib/assets/home.svg';
	import EyeIcon from '$lib/assets/eye.svg';
	import EditIcon from '$lib/assets/edit.svg';
	import TrashIcon from '$lib/assets/trashcan.svg';
	import MagnifyingGlassIcon from '$lib/assets/magnifying-glass.svg';
	import FilterIcon from '$lib/assets/filter.svg';
	import DropdownIcon from '$lib/assets/dropdown.svg';

	export let type = 'default';
	export let size = 8;
	export let customClass = '';

	let iconSrc;
	switch (type) {
		case 'home':
			iconSrc = HomeIcon;
			break;
		case 'eye':
			iconSrc = EyeIcon;
			break;
		case 'edit':
			iconSrc = EditIcon;
			break;
		case 'trash':
			iconSrc = TrashIcon;
			break;
		case 'search':
			iconSrc = MagnifyingGlassIcon;
			break;
		case 'filter':
			iconSrc = FilterIcon;
			break;
		case 'dropdown':
			iconSrc = DropdownIcon;
			break;
		default:
			iconSrc = HomeIcon; // Fallback icon
	}

	// Tailwind CSS cannot detect dynamic class names like h-{size} or w-{size} at build time thats why a sizeMap is used
	const sizeMap: Record<number, string> = {
		4: 'h-4 w-4',
		6: 'h-6 w-6',
		8: 'h-8 w-8',
		10: 'h-10 w-10',
		12: 'h-12 w-12'
	};

	$: sizeClass = sizeMap[size] || 'h-8 w-8';
</script>

<img src={iconSrc} alt={type} class={`${sizeClass} ${customClass}`} />
