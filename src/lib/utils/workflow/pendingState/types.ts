import type { Coding } from '$lib/types';

/**
 * Coding type discriminator - matches section IDs
 */
export type CodingType = 'activities' | 'effects' | 'destep' | 'opportunity-structures' | 'system-vulnerabilities';

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
