import type { Coding } from '$lib/types';

/**
 * Helper: Builds a map of parent IDs to their pending children
 */
export function buildPendingByParentMap<T extends Coding>(
	pendingCodings: T[]
): Map<number, T[]> {
	const map = new Map<number, T[]>();
	pendingCodings.forEach((coding) => {
		if (coding.parent_id) {
			if (!map.has(coding.parent_id)) {
				map.set(coding.parent_id, []);
			}
			map.get(coding.parent_id)!.push(coding);
		}
	});
	return map;
}


/**
 * Recursively finds a coding by ID in a tree
 */
export function findCodingById<T extends Coding>(codings: T[], id: number): T | null {
	for (const coding of codings) {
		if (coding.id === id) return coding;
		if (coding.children) {
			const found = findCodingById(coding.children as T[], id);
			if (found) return found;
		}
	}
	return null;
}

// Normalizes coding data by ensuring children arrays are never null (recursive)
export function normalizeCodingsData<T extends Coding>(items: T[]): T[] {
	return items.map((item) => ({
		...item,
		children: item.children ? normalizeCodingsData(item.children as T[]) : []
	}));
}

/**
 * Adds pending codings to workflow codings for saving to the backend
 */
export function addPendingCodingsToWorkflow<T extends Coding>(
	workflowCodings: T[],
	pendingCodings: T[]
): T[] {
	const pendingByParent = buildPendingByParentMap(pendingCodings);

	// Recursively merges pending children into the tree
	const addSubCodingsRecursive = (coding: T): T => {
		const childrenForThis = pendingByParent.get(coding.id) || [];
		const existingChildren = (coding.children || []).map(child =>
			addSubCodingsRecursive(child as T)
		);
		const newChildren = childrenForThis.map(c => addSubCodingsRecursive(c));

		return {
			...coding,
			children: [...existingChildren, ...newChildren]
		};
	};

	const updatedCodings = workflowCodings.map(addSubCodingsRecursive);
	const topLevelPending = pendingCodings
		.filter(c => !c.parent_id)
		.map(addSubCodingsRecursive);

	return [...updatedCodings, ...topLevelPending];
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