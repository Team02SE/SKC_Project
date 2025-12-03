<script lang="ts">
	interface Props {
		number: number;
		name: string;
		description: string;
		onNumberChange: (value: number) => void;
		onNameChange: (value: string) => void;
		onDescriptionChange: (value: string) => void;
	}
	
	let { number, name, description, onNumberChange, onNameChange, onDescriptionChange }: Props = $props();
</script>

<div class="mb-6 flex w-full flex-col gap-6">
	<div>
		<label for="number" class="block text-sm font-medium text-gray-700 mb-2">
			Number <span class="text-red-500">*</span>
		</label>
		<input
			id="number"
			type="number"
			name="number"
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-button-primary"
			value={number}
			oninput={(e) => onNumberChange(Number((e.target as HTMLInputElement).value))}
			placeholder="Enter coding number"
			required
		/>
	</div>

	<div>
		<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
			Name <span class="text-red-500">*</span>
		</label>
		<input
			id="name"
			type="text"
			name="name"
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-button-primary"
			value={name}
			oninput={(e) => onNameChange((e.target as HTMLInputElement).value)}
			placeholder="Enter coding name"
			required
		/>
	</div>

	<div>
		<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
			Description
		</label>
		<textarea
			id="description"
			name="description"
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-button-primary min-h-[120px] resize-y"
			value={description}
			oninput={(e) => onDescriptionChange((e.target as HTMLTextAreaElement).value)}
			placeholder="Enter description (optional)"
		></textarea>
	</div>
</div>
