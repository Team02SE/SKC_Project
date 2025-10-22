import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ params }) => {
	const apiBase = env.API_URL;

	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: env.API_KEY,
			'X-Custom-Header': 'custom-value'
		}
	};

	const activities = await fetch(`${apiBase}/activities`, header);
	const effects = await fetch(`${apiBase}/effects`, header);
	const dsteps = await fetch(`${apiBase}/activities`, header);
	const opportunity_structures = await fetch(`${apiBase}/opportunity-structures`, header);
	const system_vulnerabilities = await fetch(`${apiBase}/system-vulnerabilities`, header);

	// Check all responses
	if (!activities.ok) {
		console.error(`Failed to fetch activities: ${activities.statusText}`);
	}
	if (!effects.ok) {
		console.error(`Failed to fetch effects: ${effects.statusText}`);
	}
	if (!dsteps.ok) {
		console.error(`Failed to fetch DESTEP: ${dsteps.statusText}`);
	}
	if (!opportunity_structures.ok) {
		console.error(`Failed to fetch opportunity structures: ${opportunity_structures.statusText}`);
	}
	if (!system_vulnerabilities.ok) {
		console.error(`Failed to fetch system vulnerabilities: ${system_vulnerabilities.statusText}`);
	}

	// Parse all responses
	const activitiesData = await activities.json();
	const effectsData = await effects.json();
	const dstepsData = await dsteps.json();
	const opportunityStructuresData = await opportunity_structures.json();
	const systemVulnerabilitiesData = await system_vulnerabilities.json();

	return {
		activities: activitiesData,
		effects: effectsData,
		dsteps: dstepsData,
		opportunityStructures: opportunityStructuresData,
		systemVulnerabilities: systemVulnerabilitiesData
	};
};
