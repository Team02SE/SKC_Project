import type { Coding } from '$lib/types';
import { getAllCodingIds, findCodingById } from '../coding/codingHelpers';
import type { PendingCodingsState, CodingType } from './pendingState/types';
import {
	createEmptyPendingState,
	addCodingToPending,
	addCodingToPendingDeletions,
	removeCodingFromPendingDeletions,
	removeCodingFromPending
} from './pendingState/operations';

export type { PendingCodingsState, CodingType } from './pendingState/types';
export { createEmptyPendingState, addCodingToPending, getTotalPendingCount,
	    hasPendingChanges, addCodingToPendingDeletions, removeCodingFromPendingDeletions,
	    removeCodingFromPending
} from './pendingState/operations';
export { mergeCodingsWithPending } from './pendingState/merger';

/**
 * Composable for managing workflow editing state
 */
export function useWorkflowState() {
	let pendingCodings = $state<PendingCodingsState>(createEmptyPendingState());

	/**
	 * Gets codings array for a specific type from the codings map.
	 * @param type - The coding type.
	 * @param codingsMap - Map of coding types to coding arrays.
	 * @returns Array of codings for the specified type.
	 */
	function getCodingsByType(
		type: CodingType,
		codingsMap: Record<CodingType, Coding[]>
	): Coding[] {
		return codingsMap[type];
	}

	/**
	 * Marks a coding and all its children for deletion.
	 * @param codingId - The ID of the coding to delete.
	 * @param type - The coding type.
	 * @param codingsMap - Map of coding types to coding arrays.
	 */
	function markCodingTreeForDeletion(
		codingId: number,
		type: CodingType,
		codingsMap: Record<CodingType, Coding[]>
	): void {
		const coding = findCodingById(getCodingsByType(type, codingsMap), codingId);
		if (coding) {
			const allIds = getAllCodingIds([coding]);
			let updatedState = pendingCodings;
			for (const id of allIds) {
				updatedState = addCodingToPendingDeletions(updatedState, id, type);
			}
			pendingCodings = updatedState;
		} else {
			pendingCodings = addCodingToPendingDeletions(pendingCodings, codingId, type);
		}
	}

	/**
	 * Unmarks a coding and all its children from deletion.
	 * @param codingId - The ID of the coding to unmark.
	 * @param type - The coding type.
	 * @param codingsMap - Map of coding types to coding arrays.
	 */
	function unmarkCodingTreeFromDeletion(
		codingId: number,
		type: CodingType,
		codingsMap: Record<CodingType, Coding[]>
	): void {
		const coding = findCodingById(getCodingsByType(type, codingsMap), codingId);
		if (coding) {
			const allIds = getAllCodingIds([coding]);
			let updatedState = pendingCodings;
			for (const id of allIds) {
				updatedState = removeCodingFromPendingDeletions(updatedState, id, type);
			}
			pendingCodings = updatedState;
		} else {
			pendingCodings = removeCodingFromPendingDeletions(pendingCodings, codingId, type);
		}
	}

	/**
	 * Handles when a new coding is added.
	 * @param coding - The coding that was added.
	 * @param type - The coding type.
	 */
	function handleCodingAdded<T extends Coding>(coding: T, type: CodingType) {
		pendingCodings = addCodingToPending(pendingCodings, type, coding);
	}

	/**
	 * Handles when a coding is deleted.
	 * @param codingId - The ID of the coding to delete.
	 * @param type - The coding type.
	 * @param codingsMap - Map of coding types to coding arrays.
	 */
	function handleCodingDeleted(
		codingId: number,
		type: CodingType,
		codingsMap: Record<CodingType, Coding[]>
	) {
		markCodingTreeForDeletion(codingId, type, codingsMap);
	}

	/**
	 * Handles when a coding operation is canceled.
	 * Removes from pending deletions or pending additions depending on state.
	 * @param codingId - The ID of the coding to cancel.
	 * @param type - The coding type.
	 * @param codingsMap - Map of coding types to coding arrays.
	 */
	function handleCodingCanceled(
		codingId: number,
		type: CodingType,
		codingsMap: Record<CodingType, Coding[]>
	) {
		if (pendingCodings.pendingDeletions.get(type)?.has(codingId)) {
			unmarkCodingTreeFromDeletion(codingId, type, codingsMap);
		} else {
			pendingCodings = removeCodingFromPending(pendingCodings, type, codingId);
		}
	}

	/**
	 * Resets all pending codings to empty state.
	 */
	function resetPendingCodings() {
		pendingCodings = createEmptyPendingState();
	}

	return {
		get pendingCodings() {
			return pendingCodings;
		},
		handleCodingAdded,
		handleCodingDeleted,
		handleCodingCanceled,
		resetPendingCodings
	};
}
