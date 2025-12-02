import type { Coding } from '$lib/types';
import type { CodingType } from './types';
import { normalizeCodingsData, buildPendingByParentMap } from '../../coding/codingHelpers';

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

	// Marks deleted codings recursively
	const markDeleted = (coding: T): T => ({
		...coding,
		isDeleted:
			pendingDeletions && currentType
				? pendingDeletions.get(currentType)?.has(coding.id) || false
				: false,
		children: (coding.children || []).map((child) => markDeleted(child as T))
	});

	// Recursively adds pending sub-codings to their parents
	const addSubCodingsRecursive = (coding: T, markAsNew = false): T => {
		const childrenForThis = pendingByParent.get(coding.id) || [];
		const existingChildren = (coding.children || []).map((child) =>
			addSubCodingsRecursive(child as T, false)
		);
		const newChildren = childrenForThis.map((c) => addSubCodingsRecursive(c, true));

		return {
			...coding,
			isNew: markAsNew || coding.isNew,
			children: [...existingChildren, ...newChildren]
		};
	};

	// add sub-codings and mark deleted
	const withSubCodings = normalized.map((item: T) =>
		markDeleted(addSubCodingsRecursive(item))
	);

	// Process top-level pending codings
	const topLevelPending = pendingCodings
		.filter((c) => !c.parent_id)
		.map((coding) => addSubCodingsRecursive(coding, true));

	return [...withSubCodings, ...topLevelPending];
}
