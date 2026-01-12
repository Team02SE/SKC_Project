import type { Coding } from '$lib/types';

/**
 * Coding type discriminator - matches section IDs
 */
export type CodingType =
	| 'activities'
	| 'effects'
	| 'destep'
	| 'opportunity-structures'
	| 'system-vulnerabilities';

/**
 * Unified pending state interface
 */
export interface PendingCodingsState {
	activities: Coding[];
	effects: Coding[];
	destep: Coding[];
	'opportunity-structures': Coding[];
	'system-vulnerabilities': Coding[];
	pendingDeletions: Map<CodingType, Set<number>>;
}

export function GetByType(data: PendingCodingsState, codingType: CodingType): Coding[] {
	switch (codingType) {
		case 'activities':
			return data.activities;
		case 'effects':
			return data.effects;
		case 'destep':
			return data.destep;
		case 'opportunity-structures':
			return data['opportunity-structures'];
		case 'system-vulnerabilities':
			return data['system-vulnerabilities'];
		default: {
			const _exhaustive: never = codingType;
			return _exhaustive;
		}
	}
}
