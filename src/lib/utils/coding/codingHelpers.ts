import type { Coding } from '$lib/types';
import type { CodingData } from '$lib/components/Codings/Management/TreeCodings.svelte';

/**
 * Converts a Coding object to CodingData format for TreeCodings component.
 * @param coding - The Coding object to convert.
 * @returns The corresponding CodingData object.
 */
export function codingToCodingData(coding: Coding): CodingData {
	return {
		id: coding.id,
		title: coding.name,
		label: coding.number.toString(),
		children: coding.children?.map((child) => codingToCodingData(child)),
		isNew: coding.isNew,
		isDeleted: coding.isDeleted,
		reason: coding.reason
	} as CodingData;
}

/**
 * Builds a map of parent IDs to their pending children.
 * @param pendingCodings - Array of pending codings to organize by parent.
 * @returns A Map where keys are parent IDs and values are arrays of child codings.
 */
export function buildPendingByParentMap<T extends Coding>(pendingCodings: T[]): Map<number, T[]> {
	return pendingCodings.reduce((map, coding) => {
		if (coding.parent_id) {
			const children = map.get(coding.parent_id) || [];
			children.push(coding);
			map.set(coding.parent_id, children);
		}
		return map;
	}, new Map<number, T[]>());
}

/**
 * Recursively finds a coding by ID in a tree structure.
 * @param codings - Array of codings to search through.
 * @param id - The ID of the coding to find.
 * @returns The found coding or null if not found.
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

/**
 * Normalizes a coding type string by replacing underscores and spaces with hyphens.
 * Converts: 'system_vulnerabilities' or 'System Vulnerabilities' -> 'system-vulnerabilities'
 * @param type - The type string to normalize.
 * @returns Normalized type string with hyphens.
 */
export function normalizeType(type: string): string {
	return type.replace(/[_\s]+/g, '-').toLowerCase();
}

/**
 * Recursively normalizes the type field of codings and their children.
 * Ensures consistent type format throughout the coding tree.
 * @param codings - Array of codings to normalize.
 * @returns Array of codings with normalized type fields.
 */
export function normalizeCodingTypes<T extends Coding>(codings: T[]): T[] {
	return codings.map((coding) => ({
		...coding,
		type: normalizeType(coding.type),
		children: coding.children ? normalizeCodingTypes(coding.children as T[]) : []
	}));
}

/**
 * Normalizes coding data by ensuring children arrays are never null (recursive).
 * @param items - Array of codings to normalize.
 * @returns Normalized array where all children properties are arrays (never null).
 */
export function normalizeCodingsData<T extends Coding>(items: T[]): T[] {
	return items.map((item) => ({
		...item,
		children: item.children ? normalizeCodingsData(item.children as T[]) : []
	}));
}

/**
 * Adds pending codings to workflow codings for saving to the backend.
 * Merges pending codings into the existing workflow coding tree structure.
 * @param workflowCodings - Existing workflow codings.
 * @param pendingCodings - Pending codings to add.
 * @returns Combined array with pending codings merged into the tree.
 */
export function addPendingCodingsToWorkflow<T extends Coding>(
	workflowCodings: T[],
	pendingCodings: T[]
): T[] {
	const pendingByParent = buildPendingByParentMap(pendingCodings);
	const pendingUpdatesById = new Map(pendingCodings.map((p) => [p.id, p]));
	const existingIds = getAllCodingIds(workflowCodings);

	// Recursively merges pending children into the tree and applies updates
	const addSubCodingsRecursive = (coding: T): T => {
		const pendingUpdate = pendingUpdatesById.get(coding.id);
		const childrenForThis = pendingByParent.get(coding.id) || [];

		return {
			...coding,
			...(pendingUpdate?.reason !== undefined && { reason: pendingUpdate.reason }),
			children: [
				...(coding.children || []).map((child) => addSubCodingsRecursive(child as T)),
				...childrenForThis.map((c) => addSubCodingsRecursive(c))
			]
		};
	};

	const updatedCodings = workflowCodings.map(addSubCodingsRecursive);
	const topLevelPending = pendingCodings
		.filter((c) => !c.parent_id && !existingIds.has(c.id))
		.map(addSubCodingsRecursive);

	return [...updatedCodings, ...topLevelPending];
}

/**
 * Recursively collects all coding IDs from an array of codings, including nested children.
 * @param codings - Array of codings to extract IDs from.
 * @returns A Set containing all unique coding IDs.
 */
export function getAllCodingIds<T extends Coding>(codings: T[]): Set<number> {
	const ids = new Set<number>();
	const traverse = (coding: T) => {
		ids.add(coding.id);
		coding.children?.forEach((child) => traverse(child as T));
	};
	codings.forEach(traverse);
	return ids;
}
