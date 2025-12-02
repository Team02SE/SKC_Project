import type { Actions } from './$types';
import { apiFetch } from '$lib/utils/server/api';

export const actions = {
	codings: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name');
		const description = data.get('description');
		const number = data.get('number');
		const type = (data.get('type') as string || '').replace(/[\s_]+/g, '-').toLowerCase().trim();
		const parent_id = data.get('parent_id');

		if (!type) {
			throw new Error('Missing type parameter');
		}

		const processedParentId = parent_id && parent_id !== '' ? Number(parent_id) : null;

		const payload: {
			name: FormDataEntryValue | null;
			description: FormDataEntryValue | null;
			number: number;
			parent_id?: number;
		} = {
			name,
			description,
			number: number ? Number(number) : 0
		};

		if (processedParentId !== null) {
			payload.parent_id = processedParentId;
		}

		const result = await apiFetch(`/${type}`, {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		if (result.error) {
			console.error(`API Error [${result.status}]:`, result.error);
			throw new Error(`Failed to create coding: ${result.status} ${result.error}`);
		}

		return { success: true, data: result.data };
	}
} satisfies Actions;
