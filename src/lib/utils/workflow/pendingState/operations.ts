import type { Coding } from '$lib/types';
import type { PendingCodingsState, CodingType } from './types';

/**
 * Helper: Creates a deletion key for tracking pending deletions
 */
export function createDeletionKey(type: CodingType | string, codingId: number): string {
	return `${type}:${codingId}`;
}

/**
 * Creates an empty pending state
 */
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

/**
 * Adds a coding to the pending state for a specific type
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
 * Gets the total count of pending changes (additions + deletions)
 */
export function getTotalPendingCount(state: PendingCodingsState): number {
	const additionsCount = Object.entries(state)
		.filter(([key]) => key !== 'pendingDeletions')
		.reduce((sum, [, arr]) => sum + (arr as any[]).length, 0);
	return additionsCount + state.pendingDeletions.size;
}

/**
 * Checks if there are any pending changes
 */
export function hasPendingChanges(state: PendingCodingsState): boolean {
	return getTotalPendingCount(state) > 0;
}

/**
 * Adds a coding to pending deletions
 */
export function addCodingToPendingDeletions(
	state: PendingCodingsState,
	codingId: number,
	type: CodingType
): PendingCodingsState {
	const newDeletions = new Set(state.pendingDeletions);
	newDeletions.add(createDeletionKey(type, codingId));
	return {
		...state,
		pendingDeletions: newDeletions
	};
}

/**
 * Removes a coding from pending deletions
 */
export function removeCodingFromPendingDeletions(
	state: PendingCodingsState,
	codingId: number,
	type: CodingType
): PendingCodingsState {
	const newDeletions = new Set(state.pendingDeletions);
	newDeletions.delete(createDeletionKey(type, codingId));
	return {
		...state,
		pendingDeletions: newDeletions
	};
}

/**
 * Removes a coding from the pending additions list
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
