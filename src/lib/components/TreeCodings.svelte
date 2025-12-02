<script context="module" lang="ts">
	export interface CodingData {
		id: number;
		title: string;
		label: string;
		buttonIcon?: string;
		children?: CodingData[];
		isNew?: boolean;
		isDeleted?: boolean;
	}
</script>

<script lang="ts">
	import CardCodings from './CardCodings.svelte';

	export let data: CodingData;
	export let type:
		| 'activities'
		| 'effects'
		| 'opportunity-structures'
		| 'system-vulnerabilities'
		| 'destep';
	export let codingId: number | undefined = undefined;
	export let hasDeletedAncestor: boolean = false;
	export let onAddSubRequest: ((parentId: number) => void) | undefined = undefined;
	export let onDeleteRequest: ((codingId: number) => void) | undefined = undefined;
	export let onCancelRequest: ((codingId: number) => void) | undefined = undefined;
</script>

<div class="flex h-auto w-full flex-col gap-3">
	<CardCodings
		title={data.title}
		label={data.label}
		buttonIcon={data.buttonIcon}
		isNew={data.isNew}
		isDeleted={data.isDeleted}
		type={type}
		{codingId}
		{hasDeletedAncestor}
		{onAddSubRequest}
		{onDeleteRequest}
		{onCancelRequest}
	/>
	<div class="ml-5">
		{#if data.children && data.children.length > 0}
			<div class="mt-2 flex flex-col gap-2">
				{#each data.children ?? [] as child}
					<svelte:self
						data={child}
						type={type}
						codingId={child.id}
						hasDeletedAncestor={hasDeletedAncestor || (data.isDeleted ?? false)}
						{onAddSubRequest}
						{onDeleteRequest}
						{onCancelRequest}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>