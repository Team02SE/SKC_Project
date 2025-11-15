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
			res.json();
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
		activities: activitiesData as Coding[],
		effects: effectsData as Coding[],
		dsteps: dstepsData as Coding[],
		opportunityStructures: opportunityStructuresData as Coding[],
		systemVulnerabilities: systemVulnerabilitiesData as Coding[]
	};
};

export const actions = {
	codings: async ({ request }) => {
		const data = await request.formData();

		const name = data.get(`name`);
		const description = data.get(`description`);
		const number = data.get(`number`);
		const type = (data.get(`type`) as string || '').toLowerCase().trim();
		const parent_id = data.get(`parent_id`);

		if (!type) {
			throw new Error('Missing type parameter');
		}

		const url = `${env.API_URL}/${type}`;

		console.log("sending request");

		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: env.API_KEY
			},
			body: JSON.stringify({
				name,
				description,
				number: number ? Number(number) : 0,
				parent_id: parent_id ? Number(parent_id) : null
			})
		});

		console.log("sending");

		if (!res.ok) {
			const errorBody = await res.text();
			console.error(`API Error [${res.status}]:`, errorBody);
			throw new Error(`Failed to create coding: ${res.status} ${res.statusText}`);
		}
		return { success: true };
	}
} satisfies Actions;
