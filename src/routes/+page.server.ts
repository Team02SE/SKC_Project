import type { PageServerLoad } from './$types';
import type { WorkflowDocument } from '$lib/types';
import { apiFetch } from '$lib/utils/server/api';

export const load: PageServerLoad = async () => {
	const { data, error } = await apiFetch<WorkflowDocument[]>('/documents');

	if (error) {
		console.error('Failed to fetch documents:', error);
		return { documents: [] };
	}

	console.log('Documents fetched successfully:', data?.length ?? 0);

	return {
		documents: data || []
	};
};
