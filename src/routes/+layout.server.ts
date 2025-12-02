import type { LayoutServerLoad } from './$types';
import type { Activity, Effect, DStep, OpportunityStructure, SystemVulnerability } from '$lib/types';
import { apiFetchMultiple } from '$lib/utils/server/api';
import { createEmptyCodings } from '$lib/utils/server/transformers';

export const load: LayoutServerLoad = async () => {
	const { data, errors } = await apiFetchMultiple<{
		activities: Activity[];
		effects: Effect[];
		destep: DStep[];
		'opportunity-structures': OpportunityStructure[];
		'system-vulnerabilities': SystemVulnerability[];
	}>({
		activities: '/activities',
		effects: '/effects',
		destep: '/dsteps',
		'opportunity-structures': '/opportunity-structures',
		'system-vulnerabilities': '/system-vulnerabilities'
	});

	if (Object.keys(errors).length > 0) {
		console.error('Error loading some codings:', errors);
	} else {
		console.log('All codings loaded in root layout');
	}

	return {
		allCodings: {
			...createEmptyCodings(),
			...data
		}
	};
};