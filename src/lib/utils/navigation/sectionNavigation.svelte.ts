/**
 * Section IDs for navigation
 */
export type SectionId =
	| 'essence'
	| 'activities'
	| 'effects'
	| 'destep'
	| 'opportunity'
	| 'vulnerabilities';

/**
 * Section references map
 */
export interface SectionRefs {
	essence: HTMLDivElement | null;
	activities: HTMLDivElement | null;
	effects: HTMLDivElement | null;
	destep: HTMLDivElement | null;
	opportunity: HTMLDivElement | null;
	vulnerabilities: HTMLDivElement | null;
}

/**
 * Composable for managing section scrolling and navigation
 */
export function useSectionNavigation() {
	let selectedId = $state<SectionId | null>(null);
	let containerRef: HTMLDivElement | null = null;
	let sectionRefs: SectionRefs = $state({
		essence: null,
		activities: null,
		effects: null,
		destep: null,
		opportunity: null,
		vulnerabilities: null
	});

	function setContainerRef(node: HTMLDivElement | null) {
		containerRef = node;
	}

	function setSectionRef(section: SectionId, node: HTMLDivElement | null) {
		sectionRefs[section] = node;
	}

	function onContainerScroll() {
		if (!containerRef) return;
		const containerTop = containerRef.getBoundingClientRect().top;

		const sections: Array<{ id: SectionId; ref: HTMLDivElement | null }> = [
			{ id: 'essence', ref: sectionRefs.essence },
			{ id: 'activities', ref: sectionRefs.activities },
			{ id: 'effects', ref: sectionRefs.effects },
			{ id: 'destep', ref: sectionRefs.destep },
			{ id: 'opportunity', ref: sectionRefs.opportunity },
			{ id: 'vulnerabilities', ref: sectionRefs.vulnerabilities }
		];

		let minDiff = Infinity;
		let nearest: SectionId | null = null;

		for (const s of sections) {
			if (!s.ref) continue;
			const rect = s.ref.getBoundingClientRect();
			const diff = Math.abs(rect.top - containerTop);
			if (diff < minDiff) {
				minDiff = diff;
				nearest = s.id;
			}
		}
		selectedId = nearest;
	}

	function scrollToSection(id: SectionId) {
		const target = sectionRefs[id];
		if (!target || !containerRef) return;

		const containerRect = containerRef.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const offsetTop = targetRect.top - containerRect.top + containerRef.scrollTop;

		const topPadding = 8;
		containerRef.scrollTo({ top: Math.max(0, offsetTop - topPadding), behavior: 'smooth' });
	}

	return {
		get selectedId() {
			return selectedId;
		},
		setContainerRef,
		setSectionRef,
		onContainerScroll,
		scrollToSection
	};
}
