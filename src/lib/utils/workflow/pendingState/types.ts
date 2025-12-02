import type { Coding } from '$lib/types';

/**
 * Coding type discriminator
 */
export type CodingType = 'activities' | 'effects' | 'dsteps' | 'os' | 'sv';

/**
 * Unified pending state interface
 */
export interface PendingCodingsState {
	activities: Coding[];
	effects: Coding[];
	dsteps: Coding[];
	os: Coding[];
	sv: Coding[];
	pendingDeletions: Map<CodingType, Set<number>>;
}
