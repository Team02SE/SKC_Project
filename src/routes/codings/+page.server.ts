import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { Coding } from '$lib/types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const apiBase = env.API_URL;

	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: env.API_KEY,
			'X-Custom-Header': 'custom-value'
		}
	};
	const [activitiesRes, effectsRes, dstepsRes, opportunityStructuresRes, systemVulnerabilitiesRes] =
		await Promise.all([
			fetch(`${apiBase}/activities`, header),
			fetch(`${apiBase}/effects`, header),
			fetch(`${apiBase}/dsteps`, header), // Note: This seems to be the same as activities endpoint?
			fetch(`${apiBase}/opportunity-structures`, header),
			fetch(`${apiBase}/system-vulnerabilities`, header)
		]);

	// Check all responses
	const responses = [
		activitiesRes,
		effectsRes,
		dstepsRes,
		opportunityStructuresRes,
		systemVulnerabilitiesRes
	];

	const endpoints = [
		'activities',
		'effects',
		'opportunity-structures',
		'dsteps',
		'system-vulnerabilities'
	];

	responses.forEach((res, index) => {
		if (!res.ok) {
			console.error('Failed to fetch' + endpoints[index] + ':' + res.statusText);
			throw new Error(`Failed to fetch ${endpoints[index]}: ${res.statusText}`);
		}
	});

	const [
		activitiesData,
		effectsData,
		dstepsData,
		opportunityStructuresData,
		systemVulnerabilitiesData
	] = await Promise.all([
		activitiesRes.json(),
		effectsRes.json(),
		dstepsRes.json(),
		opportunityStructuresRes.json(),
		systemVulnerabilitiesRes.json()
	]);

	return {
		activities: activitiesData.map((c: Coding) => ({ ...c, expanded: false, category: "activities" })) as Coding[],
		effects: effectsData.map((c: Coding) => ({ ...c, expanded: false, category: "effects" })) as Coding[],
		dsteps: dstepsData.map((c: Coding) => ({ ...c, expanded: false, category: "dsteps" })) as Coding[],
		opportunityStructures: opportunityStructuresData.map((c: Coding) => ({ ...c, expanded: false, category: "opportunity-structures" })) as Coding[],
		systemVulnerabilities: systemVulnerabilitiesData.map((c: Coding) => ({ ...c, expanded: false, category: "system-vulnerabilities" })) as Coding[],
	};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
} satisfies Actions;
