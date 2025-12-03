<script module lang="ts">
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
	import CardCodings from '../../Cards/CardCodings.svelte';
	import TreeCodings from './TreeCodings.svelte';

	interface Props {
		data: CodingData;
		type:
			| 'activities'
			| 'effects'
			| 'opportunity-structures'
			| 'system-vulnerabilities'
			| 'destep';
		codingId?: number;
		hasDeletedAncestor?: boolean;
		onAddSubRequest?: (parentId: number) => void;
		onDeleteRequest?: (codingId: number) => void;
		onCancelRequest?: (codingId: number) => void;
	}

	let {
		data,
		type,
		codingId = undefined,
		hasDeletedAncestor = false,
		onAddSubRequest = undefined,
		onDeleteRequest = undefined,
		onCancelRequest = undefined
	}: Props = $props();
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
					<TreeCodings
						data={child}
						{type}
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