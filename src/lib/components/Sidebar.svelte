<script lang="ts">
	import { onMount } from 'svelte';

	let { sections = ['essence', 'activities', 'effects', 'destep', 'opportunity-structures', 'system-vulnerabilities'] } = $props();

	let activeSection = $state('');

	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	}

	function handleScroll() {
		const scrollPosition = window.scrollY + 100;

		for (const section of sections) {
			const element = document.getElementById(section);
			if (element) {
				const { offsetTop, offsetHeight } = element;
				if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
					activeSection = section;
					break;
				}
			}
		}
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	const navItems = [
		{ id: 'essence', letter: 'E', label: 'Essence' },
		{ id: 'activities', letter: 'A', label: 'Activities' },
		{ id: 'effects', letter: 'E', label: 'Effects' },
		{ id: 'destep', letter: 'D', label: 'DESTEP' },
		{ id: 'opportunity-structures', letter: 'O', label: 'Opportunity Structures' },
		{ id: 'system-vulnerabilities', letter: 'S', label: 'System Vulnerabilities' }
	];
</script>

<div class="fixed left-0 top-1/2 w-20 h-auto -translate-y-1/2 flex flex-col items-center py-8 pl-10 space-y-6 z-50">
	<div class="flex flex-col space-y-4 mt-8">
		{#each navItems as item}
			<div class="flex flex-col items-center space-y-2">
				<button
					onclick={() => scrollToSection(item.id)}
					class="rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
					class:w-12={activeSection === item.id}
					class:h-12={activeSection === item.id}
					class:w-10={activeSection !== item.id}
					class:h-10={activeSection !== item.id}
					style="background-color: {activeSection === item.id ? 'var(--color-light-active-primary)' : 'var(--color-light-secondary)'};"
					aria-label={item.label}
				>
					<span class="text-white font-bold" style="color: var(--color-light-button-content-primary);">{item.letter}</span>
				</button>
				{#if activeSection === item.id}
					<span class="text-xs font-medium text-center" style="color: var(--color-light-text-primary);">{item.label}</span>
				{/if}
			</div>
		{/each}
	</div>

	<div class="flex flex-col space-y-4 mt-12 mb-8">
		<div class="flex flex-col items-center space-y-2">
			<button
				class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
				style="background-color: var(--color-light-secondary);"
				aria-label="ERD View"
			>
				<svg class="w-6 h-6" style="color: var(--color-light-button-content-primary);" fill="currentColor" viewBox="0 0 20 20">
					<path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
				</svg>
			</button>
		</div>

		<div class="flex flex-col items-center space-y-2">
			<button
				class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
				style="background-color: var(--color-light-active-primary);"
				aria-label="Save"
			>
				<svg class="w-8 h-8" style="color: var(--color-light-button-content-primary);" fill="none" viewBox="0 0 24 24">
					<path d="M7 21H17C19.2091 21 21 19.2091 21 17V7.41421C21 7.149 20.8946 6.89464 20.7071 6.70711L17.2929 3.29289C17.1054 3.10536 16.851 3 16.5858 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9 3H15V6C15 6.55228 14.5523 7 14 7H10C9.44772 7 9 6.55228 9 6V3Z" stroke="white" stroke-width="2"/>
					<path d="M17 21V14C17 13.4477 16.5523 13 16 13H8C7.44772 13 7 13.4477 7 14V21" stroke="white" stroke-width="2"/>
					<path d="M11 17H13" stroke="white" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>
		</div>
	</div>
</div>
