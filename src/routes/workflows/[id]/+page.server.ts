import type { PageServerLoad } from './$types';
import type { WorkflowDocument } from '$lib/types';
import { apiFetch, getApiBaseUrl, createApiHeaders } from '$lib/utils/server/api';
import { transformWorkflowFromBackend } from '$lib/utils/server/transformers';

export const load: PageServerLoad = async ({ params }) => {
	const documentId = params.id;

	// Fetch workflow and document data in parallel (apiFetch handles errors)
	const [workflowResult, documentResult] = await Promise.all([
		apiFetch(`/workflows/${documentId}`),
		apiFetch<WorkflowDocument>(`/documents/${documentId}`)
	]);

	// Fetch PDF file (optional - don't fail if unavailable)
	let pdfUrl: string | null = null;
	try {
		const apiBase = getApiBaseUrl();
		const pdfResponse = await fetch(`${apiBase}/documents/file/${documentId}`, {
			headers: createApiHeaders(false)
		});

		if (pdfResponse.ok) {
			const pdfData = await pdfResponse.blob();
			pdfUrl = URL.createObjectURL(pdfData);
		}
	} catch (err) {
		console.error('Error fetching PDF:', err);
	}

	return {
		documentData: documentResult.data!,
		workflowData: transformWorkflowFromBackend(workflowResult.data),
		pdfUrl
	};
};
