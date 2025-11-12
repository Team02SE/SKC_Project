// place files you want to import through the `$lib` alias in this folder.

import type { Coding } from './types';
import type { CodingData } from './components/TreeCodings.svelte';

//Adds buttonIcon only to leaf nodes
export function codingToCodingData(coding: Coding, buttonIcon?: string): CodingData {
	const hasChildren = coding.children && coding.children.length > 0;
	
	return {
		title: coding.name,
		label: coding.number.toString(),
		buttonIcon: hasChildren ? undefined : buttonIcon,
		children: coding.children?.map(child => codingToCodingData(child, buttonIcon))
	};
}