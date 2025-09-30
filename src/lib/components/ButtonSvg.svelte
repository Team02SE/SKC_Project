<script>
    import HomeIcon from '$lib/assets/home.svg';
    import EyeIcon from '$lib/assets/eye.svg';
    import EditIcon from '$lib/assets/edit.svg';
    import TrashIcon from '$lib/assets/trashcan.svg';
    import MagnifyingGlassIcon from '$lib/assets/magnifying-glass.svg';

    export let type = 'default';
    export let size = 8;
    export let customClass = '';

    let iconSrc;
    switch(type) {
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
        default:
            iconSrc = HomeIcon; // Fallback icon
    }
</script>

<img src={iconSrc} alt={type} class={`h-${size} w-${size} ${customClass}`} />