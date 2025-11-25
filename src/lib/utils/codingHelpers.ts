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
 * Merges existing codings with pending codings
 * Also marks codings in pendingDeletions with isDeleted flag
 */
export function mergeCodingsWithPending<T extends Coding>(existingCodings: T[], pendingCodings: T[], pendingDeletions?: Set<string>, currentType?: CodingType): T[] {
	const normalized = normalizeCodingsData(existingCodings || []);

	const topLevelPending = pendingCodings.filter(c => !c.parent_id);
	const subCodingsPending = pendingCodings.filter(c => c.parent_id);

	// mark deleted codings recursively
	const markDeleted = (coding: T): T => ({
		...coding,
		isDeleted: pendingDeletions ? pendingDeletions.has(`${currentType}:${coding.id}`) : false,
		children: (coding.children || []).map(child => markDeleted(child as T))
	});

	// add sub-codings to their parents at any level
	const addSubCodingsRecursive = (coding: T): T => {
		const childrenForThis = subCodingsPending.filter(sub => sub.parent_id === coding.id);
		const existingChildren = (coding.children || []).map(child => addSubCodingsRecursive(child as T));
		const newChildren = childrenForThis.map(c => ({ ...c, children: [], isNew: true }));
		
		return {
			...coding,
			children: [...existingChildren, ...newChildren]
		};
	};

	// add sub-codings to their parents and mark deleted
	const withSubCodings = normalized.map(item => markDeleted(addSubCodingsRecursive(item)));

	// add top-level pending codings
	return [
		...withSubCodings,
		...topLevelPending.map(a => ({ ...a, children: [], isNew: true }))
	];
}

/**
 * adds pending codings to workflow codings for saving to the backend
 */
export function addPendingCodingsToWorkflow<T extends Coding>(workflowCodings: T[], pendingCodings: T[]): T[] {
	const topLevelPending = pendingCodings.filter(c => !c.parent_id);
	const subCodingsPending = pendingCodings.filter(c => c.parent_id);

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
	pendingDeletions: Set<string>; // Format: "type:id"
}

export function createEmptyPendingState(): PendingCodingsState {
	return {
		activities: [],
		effects: [],
		dsteps: [],
		os: [],
		sv: [],
		pendingDeletions: new Set<string>()
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

/**
 * Recursively collects all coding IDs including children
 */
export function getAllCodingIds<T extends Coding>(coding: T): number[] {
	const ids = [coding.id];
	if (coding.children && coding.children.length > 0) {
		for (const child of coding.children) {
			ids.push(...getAllCodingIds(child as T));
		}
	}
	return ids;
}

/**
 * Checks if any ancestor of a coding is marked for deletion
 */
export function hasAncestorMarkedForDeletion<T extends Coding>(
	codings: T[],
	codingId: number,
	pendingDeletions: Set<string>,
	currentType: CodingType,
	parentId?: number
): boolean {
	for (const coding of codings) {
		if (coding.id === codingId) {
			return parentId !== undefined && pendingDeletions.has(`${currentType}:${parentId}`);
		}
		if (coding.children) {
			const isCurrentDeleted = pendingDeletions.has(`${currentType}:${coding.id}`);
			const result = hasAncestorMarkedForDeletion(
				coding.children as T[],
				codingId,
				pendingDeletions,
				currentType,
				isCurrentDeleted ? coding.id : parentId
			);
			if (result !== null) return result;
		}
	}
	return false;
}

export function addCodingToPendingDeletions(state: PendingCodingsState, codingId: number, type: CodingType): PendingCodingsState {
	const newDeletions = new Set(state.pendingDeletions);
	newDeletions.add(`${type}:${codingId}`);
	return {
		...state,
		pendingDeletions: newDeletions
	};
}

export function removeCodingFromPendingDeletions(state: PendingCodingsState, codingId: number, type: CodingType): PendingCodingsState {
	const newDeletions = new Set(state.pendingDeletions);
	newDeletions.delete(`${type}:${codingId}`);
	return {
		...state,
		pendingDeletions: newDeletions
	};
}

export function removeCodingFromPending(state: PendingCodingsState, type: CodingType, codingId: number): PendingCodingsState {
	return {
		...state,
		[type]: state[type].filter(coding => coding.id !== codingId)
	};
}

export function removePendingDeletions<T extends Coding>(codings: T[], pendingDeletions: Set<string>, currentType: CodingType): T[] {
	if (pendingDeletions.size === 0) return codings;

	return codings
		.filter(coding => !pendingDeletions.has(`${currentType}:${coding.id}`))
		.map(coding => ({
			...coding,
			children: coding.children ? removePendingDeletions(coding.children as T[], pendingDeletions, currentType) : []
		}));
}