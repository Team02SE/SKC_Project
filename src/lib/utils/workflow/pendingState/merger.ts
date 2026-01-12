import type { Coding } from '$lib/types';
import type { CodingType } from './types';
import { normalizeCodingsData, buildPendingByParentMap, getAllCodingIds } from '../../coding/codingHelpers';

/**
 * Merges existing codings with pending codings.
 * Also marks codings in pendingDeletions with isDeleted flag.
 * @param existingCodings - Array of existing codings.
 * @param pendingCodings - Array of pending codings to merge.
 * @param pendingDeletions - Optional map of coding types to sets of deleted IDs.
 * @param currentType - Optional current coding type.
 * @returns Merged array with pending codings integrated and deleted items marked.
 */
export function mergeCodingsWithPending<T extends Coding>(
	existingCodings: T[],
	pendingCodings: T[],
	pendingDeletions?: Map<CodingType, Set<number>>,
	currentType?: CodingType
): T[] {
	const normalized = normalizeCodingsData(existingCodings || []);
	const pendingByParent = buildPendingByParentMap(pendingCodings);
	const pendingUpdatesById = new Map(pendingCodings.map((p) => [p.id, p]));
	const existingIds = getAllCodingIds(normalized);

	// Marks deleted codings recursively
	const markDeleted = (coding: T): T => ({
		...coding,
		isDeleted: pendingDeletions?.get(currentType!)?.has(coding.id) ?? false,
		children: (coding.children || []).map((child) => markDeleted(child as T))
	});

	// Recursively adds pending sub-codings to their parents and merges updates
	const addSubCodingsRecursive = (coding: T, markAsNew = false): T => {
		const pendingUpdate = pendingUpdatesById.get(coding.id);
		const childrenForThis = pendingByParent.get(coding.id) || [];

		return {
			...coding,
			...(pendingUpdate?.reason !== undefined && { reason: pendingUpdate.reason }),
			isNew: markAsNew || coding.isNew,
			children: [
				...(coding.children || []).map((child) => addSubCodingsRecursive(child as T, false)),
				...childrenForThis.map((c) => addSubCodingsRecursive(c, true))
			]
		};
	};

	// Add sub-codings and mark deleted
	const withSubCodings = normalized.map((item: T) =>
		markDeleted(addSubCodingsRecursive(item))
	);

	// Process top-level pending codings (only truly new ones, not updates to existing codings)
	const topLevelPending = pendingCodings
		.filter((c) => !c.parent_id && !existingIds.has(c.id))
		.map((coding) => addSubCodingsRecursive(coding, true));

	return [...withSubCodings, ...topLevelPending];
}
