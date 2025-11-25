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