import type { Coding } from '$lib/types';
import { addPendingCodingsToWorkflow } from '../coding/codingHelpers';
import type { PendingCodingsState, CodingType } from './workflowState.svelte';

/**
 * Removes codings marked for deletion from the tree.
 * @param codings - Array of codings to filter.
 * @param pendingDeletions - Map of coding types to sets of deleted IDs.
 * @param currentType - The current coding type.
 * @returns Filtered array with deleted codings removed.
 */
function removePendingDeletions<T extends Coding>(
	codings: T[],
	pendingDeletions: Map<CodingType, Set<number>>,
	currentType: CodingType
): T[] {
	const deletedIds = pendingDeletions.get(currentType);
	if (!deletedIds || deletedIds.size === 0) return codings;

	return codings
		.filter((coding) => !deletedIds.has(coding.id))
		.map((coding) => ({
			...coding,
			children: coding.children
				? removePendingDeletions(coding.children as T[], pendingDeletions, currentType)
				: []
		}));
}

/**
 * Create a new coding via API.
 * @param coding - The coding to create.
 * @param typeString - The type string for the API endpoint.
 * @returns The created coding with real ID, or null if creation failed.
 */
export async function createCoding(coding: Coding, typeString: string): Promise<Coding | null> {
	const formData = new FormData();
	formData.append('name', coding.name);
	formData.append('description', coding.description || '');
	formData.append('number', coding.number.toString());
	formData.append('type', typeString);
	if (coding.parent_id !== undefined && coding.parent_id !== null && coding.parent_id > 0) {
		formData.append('parent_id', coding.parent_id.toString());
	}

	try {
		const response = await fetch('/codings?/codings', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			console.error('Failed to create coding:', coding.name, 'Status:', response.status);
			return null;
		}

		const result = await response.json();

		let parsedData = result.data;
		if (typeof parsedData === 'string') {
			parsedData = JSON.parse(parsedData);
		}

		const codingId = parsedData?.[0]?.data;

		if (codingId) {
			return {
				...coding,
				id: codingId
			};
		}

		return null;
	} catch (error) {
		console.error('Error creating coding:', error);
		return null;
	}
}

/**
 * Recursively create new codings and build a map of temporary IDs to real IDs.
 * @param codings - Array of codings to create.
 * @param typeString - The type string for the API endpoint.
 * @param idMap - Map to populate with temporary ID to real ID mappings.
 */
export async function createNewCodingsAndBuildIdMap(
	codings: Coding[],
	typeString: string,
	idMap: Map<number, number>
): Promise<void> {
	for (const coding of codings) {
		if (coding.id < 0) {
			const tempId = coding.id;

			const realParentId =
				coding.parent_id && coding.parent_id < 0
					? idMap.get(coding.parent_id)
					: coding.parent_id;

			const codingToCreate = {
				...coding,
				parent_id: realParentId
			};

			const createdCoding = await createCoding(codingToCreate, typeString);
			if (createdCoding && createdCoding.id) {
				idMap.set(tempId, createdCoding.id);
			} else {
				console.error(`Failed to create coding: ${coding.name}`);
			}
		}

		if (coding.children && coding.children.length > 0) {
			await createNewCodingsAndBuildIdMap(coding.children, typeString, idMap);
		}
	}
}

/**
 * Replace temporary (negative) IDs with real IDs from the map.
 * @param codings - Array of codings with temporary IDs.
 * @param idMap - Map of temporary IDs to real IDs.
 * @returns Array of codings with real IDs.
 */
export function replaceTemporaryIds(codings: Coding[], idMap: Map<number, number>): Coding[] {
	return codings
		.map((coding) => {
			const newId = coding.id < 0 ? idMap.get(coding.id) ?? coding.id : coding.id;
			const newParentId =
				coding.parent_id && coding.parent_id < 0
					? idMap.get(coding.parent_id) ?? coding.parent_id
					: coding.parent_id;

			return {
				...coding,
				id: newId,
				parent_id: newParentId,
				children: coding.children ? replaceTemporaryIds(coding.children, idMap) : []
			};
		})
		.filter((coding) => coding.id >= 0);
}

/**
 * Apply pending changes to workflow codings.
 * @param workflowCodings - Existing workflow codings.
 * @param pendingCodingsForType - Pending codings to add.
 * @param pendingDeletions - Map of coding types to sets of deleted IDs.
 * @param type - The coding type.
 * @returns Updated codings array with pending changes applied.
 */
export function applyPendingChanges(
	workflowCodings: Coding[],
	pendingCodingsForType: Coding[],
	pendingDeletions: Map<CodingType, Set<number>>,
	type: CodingType
): Coding[] {
	return removePendingDeletions(
		addPendingCodingsToWorkflow(workflowCodings || [], pendingCodingsForType),
		pendingDeletions,
		type
	);
}

/**
 * Save all workflow changes to the server.
 * @param documentId - The document ID.
 * @param workflow - The workflow object.
 * @param pendingCodings - State containing all pending changes.
 * @throws Error if save fails.
 */
export async function saveWorkflowChanges(
	documentId: number,
	workflow: any,
	pendingCodings: PendingCodingsState
): Promise<void> {
	let updatedWorkflow = {
		...workflow,
		Activities: applyPendingChanges(
			workflow.Activities,
			pendingCodings.activities,
			pendingCodings.pendingDeletions,
			'activities'
		),
		Effects: applyPendingChanges(
			workflow.Effects,
			pendingCodings.effects,
			pendingCodings.pendingDeletions,
			'effects'
		),
		Dsteps: applyPendingChanges(
			workflow.Dsteps,
			pendingCodings.dsteps,
			pendingCodings.pendingDeletions,
			'dsteps'
		),
		Os: applyPendingChanges(
			workflow.Os,
			pendingCodings.os,
			pendingCodings.pendingDeletions,
			'os'
		),
		Sv: applyPendingChanges(
			workflow.Sv,
			pendingCodings.sv,
			pendingCodings.pendingDeletions,
			'sv'
		)
	};

	const idMap = new Map<number, number>();
	await createNewCodingsAndBuildIdMap(updatedWorkflow.Activities, 'activities', idMap);
	await createNewCodingsAndBuildIdMap(updatedWorkflow.Effects, 'effects', idMap);
	await createNewCodingsAndBuildIdMap(updatedWorkflow.Dsteps, 'dsteps', idMap);
	await createNewCodingsAndBuildIdMap(updatedWorkflow.Os, 'opportunity-structures', idMap);
	await createNewCodingsAndBuildIdMap(updatedWorkflow.Sv, 'system-vulnerabilities', idMap);

	updatedWorkflow = {
		...updatedWorkflow,
		Activities: replaceTemporaryIds(updatedWorkflow.Activities, idMap),
		Effects: replaceTemporaryIds(updatedWorkflow.Effects, idMap),
		Dsteps: replaceTemporaryIds(updatedWorkflow.Dsteps, idMap),
		Os: replaceTemporaryIds(updatedWorkflow.Os, idMap),
		Sv: replaceTemporaryIds(updatedWorkflow.Sv, idMap)
	};

	const response = await fetch(`/api/workflows/${documentId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(updatedWorkflow)
	});

	if (!response.ok) {
		throw new Error(`Failed to save changes: ${response.statusText}`);
	}
}
