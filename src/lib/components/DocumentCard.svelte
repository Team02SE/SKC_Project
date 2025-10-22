<script>
	import ButtonSvg from "./ButtonSvg.svelte";
	import {goto} from "$app/navigation"

    let {roundedTop = false, id = 0} = $props();

	function handleDelete(){
		console.error("not implemented")
	}

	function handleEdit(){
		goto(`/workflows/`+id)
	}


</script>

<div class={`flex h-32 w-full items-end justify-between bg-light-hovered-primary p-5 inset-shadow-sm/25 ${roundedTop ? 'rounded-t-2xl' : ''}`}>
	<div>
		<div class="mb-2 flex items-center gap-4">
			<h2 class="text-3xl font-semibold">DOCUMENT_NAME</h2>
			<div class="h-4 w-4 rounded-full bg-green-500"></div>
		</div>
		<p>Status: STATUS</p>
		<p>Last modified: DATE</p>
	</div>
    <div class="flex gap-4">
        <ButtonSvg type="eye"/>
        <ButtonSvg type="edit" onClick={handleEdit}/>
        <ButtonSvg type="trash" onClick={handleDelete} />
    </div>
</div>
