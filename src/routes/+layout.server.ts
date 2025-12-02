import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { Activity, Effect, DStep, OpportunityStructure, SystemVulnerability } from '$lib/types';

export const load: LayoutServerLoad = async () => {
	const apiBase = env.API_URL;

	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: env.API_KEY
		}
	};

	try {
		const [activitiesRes, effectsRes, dstepsRes, osRes, svRes] = await Promise.all([
			fetch(`${apiBase}/activities`, header),
			fetch(`${apiBase}/effects`, header),
			fetch(`${apiBase}/dsteps`, header),
			fetch(`${apiBase}/opportunity-structures`, header),
			fetch(`${apiBase}/system-vulnerabilities`, header)
		]);

		const [activities, effects, dsteps, opportunityStructures, systemVulnerabilities] = await Promise.all([
			activitiesRes.json(),
			effectsRes.json(),
			dstepsRes.json(),
			osRes.json(),
			svRes.json()
		]);

		console.log('All codings loaded in root layout');

		return {
			allCodings: {
				activities: activities as Activity[],
				effects: effects as Effect[],
				destep: dsteps as DStep[],
				'opportunity-structures': opportunityStructures as OpportunityStructure[],
				'system-vulnerabilities': systemVulnerabilities as SystemVulnerability[]
			}
		};
	} catch (error) {
		console.error('Error loading codings in root layout:', error);
		return {
			allCodings: {
				activities: [],
				effects: [],
				destep: [],
				'opportunity-structures': [],
				'system-vulnerabilities': []
			}
		};
	}
};