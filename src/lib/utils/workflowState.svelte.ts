import type { Coding } from '$lib/types';
import {
	createEmptyPendingState,
	addCodingToPending,
	addCodingToPendingDeletions,
	removeCodingFromPendingDeletions,
	removeCodingFromPending,
	getAllCodingIds,
	findCodingById,
	type PendingCodingsState,
	type CodingType
} from './codingHelpers';

/**
 * Composable for managing workflow editing state
 */
export function useWorkflowState() {
	let pendingCodings = $state<PendingCodingsState>(createEmptyPendingState());

	function getCodingsByType(
		type: CodingType,
		codingsMap: Record<CodingType, Coding[]>
	): Coding[] {
		return codingsMap[type];
	}

	function markCodingTreeForDeletion(
		codingId: number,
		type: CodingType,
		codingsMap: Record<CodingType, Coding[]>
	): void {
		const coding = findCodingById(getCodingsByType(type, codingsMap), codingId);
		if (coding) {
			const allIds = getAllCodingIds(coding);
			let updatedState = pendingCodings;
			for (const id of allIds) {
				updatedState = addCodingToPendingDeletions(updatedState, id, type);
			}
			pendingCodings = updatedState;
		} else {
			pendingCodings = addCodingToPendingDeletions(pendingCodings, codingId, type);
		}
	}

	function unmarkCodingTreeFromDeletion(
		codingId: number,
		type: CodingType,
		codingsMap: Record<CodingType, Coding[]>
	): void {
		const coding = findCodingById(getCodingsByType(type, codingsMap), codingId);
		if (coding) {
			const allIds = getAllCodingIds(coding);
			let updatedState = pendingCodings;
			for (const id of allIds) {
				updatedState = removeCodingFromPendingDeletions(updatedState, id, type);
			}
			pendingCodings = updatedState;
		} else {
			pendingCodings = removeCodingFromPendingDeletions(pendingCodings, codingId, type);
		}
	}

	function handleCodingAdded<T extends Coding>(coding: T, type: CodingType) {
		pendingCodings = addCodingToPending(pendingCodings, type, coding);
	}

	function handleCodingDeleted(
		codingId: number,
		type: CodingType,
		codingsMap: Record<CodingType, Coding[]>
	) {
		markCodingTreeForDeletion(codingId, type, codingsMap);
	}

	function handleCodingCanceled(
		codingId: number,
		type: CodingType,
		codingsMap: Record<CodingType, Coding[]>
	) {
		if (pendingCodings.pendingDeletions.has(`${type}:${codingId}`)) {
			unmarkCodingTreeFromDeletion(codingId, type, codingsMap);
		} else {
			pendingCodings = removeCodingFromPending(pendingCodings, type, codingId);
		}
	}

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
