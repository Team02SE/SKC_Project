import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const pdfUrl = url.searchParams.get('url');

	if (!pdfUrl) {
		throw error(400, 'PDF URL is required');
	}

	try {
		const response = await fetch(pdfUrl);

		if (!response.ok) {
			throw error(response.status, `Failed to fetch PDF: ${response.statusText}`);
		}

		const contentType = response.headers.get('content-type');
		if (contentType && !contentType.includes('pdf')) {
			throw error(400, 'URL does not point to a PDF file');
		}

		const buffer = await response.arrayBuffer();

		return new Response(buffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'inline',
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (err: any) {
		console.log('Error proxying PDF:', err);
		throw error(500, err.message || 'Failed to load PDF');
	}
};
