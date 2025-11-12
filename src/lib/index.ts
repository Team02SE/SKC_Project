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
		children: coding.children?.map(child => codingToCodingData(child))
	};
}