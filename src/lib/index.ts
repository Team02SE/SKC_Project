// place files you want to import through the `$lib` alias in this folder.

import type { Coding } from './types';
import type { CodingData } from './components/TreeCodings.svelte';

/**
 * Converts a Coding object to CodingData format for TreeCodings component.
 * @param coding - The Coding object to convert.
 * @returns The corresponding CodingData object.
 */
export function codingToCodingData(coding: Coding): CodingData {
	return {
		title: coding.name,
		label: coding.number.toString(),
		children: coding.children?.map(child => codingToCodingData(child)),
		isNew: coding.isNew
	};
}

/**
 * Recursively collects all coding IDs from an array of codings, including nested children.
 * @param codings - Array of codings to extract IDs from.
 * @returns A Set containing all unique coding IDs.
 */
export function getAllCodingIds(codings: Coding[]): Set<number> {
	const ids = new Set<number>();
	function traverse(coding: Coding) {
		ids.add(coding.id);
		if (coding.children) {
			coding.children.forEach(child => traverse(child));
		}
	}
	codings.forEach(traverse);
	return ids;
}

/**
 * Creates a handler function for adding sub-codings to a parent coding.
 * @param data - The array of codings (will be mutated)
 * @param parentId - The ID of the parent coding
 * @param onCodingAdded - Optional callback to call after adding
 * @param onClose - Optional callback to close the popup
 * @returns A function that handles adding a sub-coding
 */
export function createSubCodingHandler<T extends Coding>(
	getData: () => T[],
	setData: (data: T[]) => void,
	parentId: () => number | null,
	onCodingAdded?: (coding: T) => void,
	onClose?: () => void
) {
	return (coding: T) => {
		const currentParentId = parentId();
		if (!currentParentId) return;

		const newSubCoding: T = {
			...coding,
			parent_id: currentParentId,
			isNew: true,
			children: null
		} as T;

		const updatedData = getData().map(item => {
			if (item.id === currentParentId) {
				return {
					...item,
					children: [...(item.children || []), newSubCoding]
				} as T;
			}
			return item;
		});

		setData(updatedData);

		if (onCodingAdded) {
			onCodingAdded(newSubCoding);
		}

		if (onClose) {
			onClose();
		}
	};
}