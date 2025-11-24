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
 * Also marks codings in pendingDeletions with isDeleted flag
 */
export function mergeCodingsWithPending<T extends Coding>(existingCodings: T[], pendingCodings: T[], pendingDeletions?: Set<number>): T[] {
	const normalized = normalizeCodingsData(existingCodings || []);

	// Separate pending into top-level and sub-codings
	const topLevelPending = pendingCodings.filter(c => !c.parent_id);
	const subCodingsPending = pendingCodings.filter(c => c.parent_id);

	// Helper to mark deleted codings recursively
	const markDeleted = (coding: T): T => ({
		...coding,
		isDeleted: pendingDeletions?.has(coding.id) ?? false,
		children: (coding.children || []).map(child => markDeleted(child as T))
	});

	// Recursively add sub-codings to their parents at any level
	const addSubCodingsRecursive = (coding: T): T => {
		const childrenForThis = subCodingsPending.filter(sub => sub.parent_id === coding.id);
		const existingChildren = (coding.children || []).map(child => addSubCodingsRecursive(child as T));
		const newChildren = childrenForThis.map(c => ({ ...c, children: [], isNew: true }));
		
		return {
			...coding,
			children: [...existingChildren, ...newChildren]
		};
	};

	// Add sub-codings to their parents and mark deleted
	const withSubCodings = normalized.map(item => markDeleted(addSubCodingsRecursive(item)));

	// Add top-level pending codings
	return [
		...withSubCodings,
		...topLevelPending.map(a => ({ ...a, children: [], isNew: true }))
	];
}

/**
 * Adds pending codings to workflow codings for saving to the backend
 */
export function addPendingCodingsToWorkflow<T extends Coding>(workflowCodings: T[], pendingCodings: T[]): T[] {
	const topLevelPending = pendingCodings.filter(c => !c.parent_id);
	const subCodingsPending = pendingCodings.filter(c => c.parent_id);

	// Recursively add sub-codings to their parents at any level
	const addSubCodingsRecursive = (coding: T): T => {
		const childrenForThis = subCodingsPending.filter(sub => sub.parent_id === coding.id);
		const existingChildren = (coding.children || []).map(child => addSubCodingsRecursive(child as T));
		
		return {
			...coding,
			children: [...existingChildren, ...childrenForThis]
		};
	};

	const updatedCodings = workflowCodings.map(item => addSubCodingsRecursive(item));

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
	pendingDeletions: Set<number>;
}

export function createEmptyPendingState(): PendingCodingsState {
	return {
		activities: [],
		effects: [],
		dsteps: [],
		os: [],
		sv: [],
		pendingDeletions: new Set<number>()
	};
}

export function addCodingToPending<T extends Coding>(state: PendingCodingsState, type: CodingType, coding: T): PendingCodingsState {
	return {
		...state,
		[type]: [...state[type], coding]
	};
}

export function getTotalPendingCount(state: PendingCodingsState): number {
	const additionsCount = Object.entries(state)
		.filter(([key]) => key !== 'pendingDeletions')
		.reduce((sum, [, arr]) => sum + (arr as any[]).length, 0);
	return additionsCount + state.pendingDeletions.size;
}

export function hasPendingChanges(state: PendingCodingsState): boolean {
	return getTotalPendingCount(state) > 0;
}

export function removeCodingById<T extends Coding>(codings: T[], codingId: number): T[] {
	return codings
		.filter(coding => coding.id !== codingId)
		.map(coding => ({
			...coding,
			children: coding.children ? removeCodingById(coding.children as T[], codingId) : []
		}));
}

export function addCodingToPendingDeletions(state: PendingCodingsState, codingId: number): PendingCodingsState {
	return {
		...state,
		pendingDeletions: new Set([...state.pendingDeletions, codingId])
	};
}

export function removePendingDeletions<T extends Coding>(codings: T[], pendingDeletions: Set<number>): T[] {
	if (pendingDeletions.size === 0) return codings;

	return codings
		.filter(coding => !pendingDeletions.has(coding.id))
		.map(coding => ({
			...coding,
			children: coding.children ? removePendingDeletions(coding.children as T[], pendingDeletions) : []
		}));
}