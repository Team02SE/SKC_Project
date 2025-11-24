import type { Coding } from '$lib/types';

/**
 * Normalizes coding data by ensuring children arrays are never null
 */
export function normalizeCodingsData<T extends Coding>(items: T[]): T[] {
	return items.map((item) => ({
		...item,
		children:
			item.children === null
				? []
				: item.children.map((child: any) => ({
						...child,
						children: child?.children === null ? [] : child?.children || []
					}))
	}));
}

/**
 * Merges existing codings with pending codings, properly nesting sub-codings
 */
export function mergeCodingsWithPending<T extends Coding>(
	existingCodings: T[],
	pendingCodings: T[]
): T[] {
	const normalized = normalizeCodingsData(existingCodings || []);
	
	// Separate pending into top-level and sub-codings
	const topLevelPending = pendingCodings.filter(c => !c.parent_id);
	const subCodingsPending = pendingCodings.filter(c => c.parent_id);
	
	// Add sub-codings to their parents
	const withSubCodings = normalized.map(item => {
		const childrenForThis = subCodingsPending.filter(sub => sub.parent_id === item.id);
		if (childrenForThis.length > 0) {
			return {
				...item,
				children: [
					...(item.children || []),
					...childrenForThis.map(c => ({ ...c, children: [], isNew: true }))
				]
			};
		}
		return item;
	});
	
	// Add top-level pending codings
	return [
		...withSubCodings,
		...topLevelPending.map(a => ({ ...a, children: [], isNew: true }))
	];
}

/**
 * Adds pending codings to workflow codings for saving to the backend
 */
export function addPendingCodingsToWorkflow<T extends Coding>(
	workflowCodings: T[],
	pendingCodings: T[]
): T[] {
	const topLevelPending = pendingCodings.filter(c => !c.parent_id);
	const subCodingsPending = pendingCodings.filter(c => c.parent_id);
	
	const updatedCodings = workflowCodings.map(item => {
		const childrenForThis = subCodingsPending.filter(sub => sub.parent_id === item.id);
		if (childrenForThis.length > 0) {
			return {
				...item,
				children: [
					...(item.children || []),
					...childrenForThis
				]
			};
		}
		return item;
	});
	
	return [...updatedCodings, ...topLevelPending];
}

/**
 * Unified pending state manager
 */
export type CodingType = 'activities' | 'effects' | 'dsteps' | 'os' | 'sv';

export interface PendingCodingsState {
	activities: Coding[];
	effects: Coding[];
	dsteps: Coding[];
	os: Coding[];
	sv: Coding[];
}

export function createEmptyPendingState(): PendingCodingsState {
	return {
		activities: [],
		effects: [],
		dsteps: [],
		os: [],
		sv: []
	};
}

export function addCodingToPending<T extends Coding>(
	state: PendingCodingsState,
	type: CodingType,
	coding: T
): PendingCodingsState {
	return {
		...state,
		[type]: [...state[type], coding]
	};
}

export function getTotalPendingCount(state: PendingCodingsState): number {
	return Object.values(state).reduce((sum, arr) => sum + arr.length, 0);
}

export function hasPendingChanges(state: PendingCodingsState): boolean {
	return getTotalPendingCount(state) > 0;
}
