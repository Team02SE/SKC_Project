import type { Coding } from '$lib/types';
import type { PendingCodingsState, CodingType } from './types';

/**
 * Creates an empty pending state.
 * @returns A new PendingCodingsState with empty arrays and maps.
 */
export function createEmptyPendingState(): PendingCodingsState {
	return {
		activities: [],
		effects: [],
		dsteps: [],
		os: [],
		sv: [],
		pendingDeletions: new Map<CodingType, Set<number>>()
	};
}

/**
 * Adds a coding to the pending state for a specific type.
 * @param state - The current pending state.
 * @param type - The coding type.
 * @param coding - The coding to add.
 * @returns A new pending state with the coding added.
 */
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

/**
 * Gets the total count of pending changes (additions + deletions).
 * @param state - The pending state to count.
 * @returns Total number of pending additions and deletions.
 */
export function getTotalPendingCount(state: PendingCodingsState): number {
	const additionsCount = Object.entries(state)
		.filter(([key]) => key !== 'pendingDeletions')
		.reduce((sum, [, arr]) => sum + (arr as any[]).length, 0);
	const deletionsCount = Array.from(state.pendingDeletions.values())
		.reduce((sum, set) => sum + set.size, 0);
	return additionsCount + deletionsCount;
}

/**
 * Checks if there are any pending changes.
 * @param state - The pending state to check.
 * @returns True if there are any pending changes, false otherwise.
 */
export function hasPendingChanges(state: PendingCodingsState): boolean {
	return getTotalPendingCount(state) > 0;
}

/**
 * Adds a coding to pending deletions.
 * @param state - The current pending state.
 * @param codingId - The ID of the coding to mark for deletion.
 * @param type - The coding type.
 * @returns A new pending state with the coding marked for deletion.
 */
export function addCodingToPendingDeletions(
	state: PendingCodingsState,
	codingId: number,
	type: CodingType
): PendingCodingsState {
	const newDeletions = new Map(state.pendingDeletions);
	const typeSet = newDeletions.get(type) || new Set<number>();
	typeSet.add(codingId);
	newDeletions.set(type, new Set(typeSet));
	return {
		...state,
		pendingDeletions: newDeletions
	};
}

/**
 * Removes a coding from pending deletions.
 * @param state - The current pending state.
 * @param codingId - The ID of the coding to unmark.
 * @param type - The coding type.
 * @returns A new pending state with the coding unmarked from deletion.
 */
export function removeCodingFromPendingDeletions(
	state: PendingCodingsState,
	codingId: number,
	type: CodingType
): PendingCodingsState {
	const newDeletions = new Map(state.pendingDeletions);
	const typeSet = newDeletions.get(type);
	if (typeSet) {
		const newTypeSet = new Set(typeSet);
		newTypeSet.delete(codingId);
		if (newTypeSet.size === 0) {
			newDeletions.delete(type);
		} else {
			newDeletions.set(type, newTypeSet);
		}
	}
	return {
		...state,
		pendingDeletions: newDeletions
	};
}

/**
 * Removes a coding from the pending additions list.
 * @param state - The current pending state.
 * @param type - The coding type.
 * @param codingId - The ID of the coding to remove.
 * @returns A new pending state with the coding removed from additions.
 */
export function removeCodingFromPending(
	state: PendingCodingsState,
	type: CodingType,
	codingId: number
): PendingCodingsState {
	return {
		...state,
		[type]: state[type].filter((coding) => coding.id !== codingId)
	};
}
