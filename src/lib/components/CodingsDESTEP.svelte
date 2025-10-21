<script lang="ts">
	import CardCodings from './CardCodings.svelte';
	import AddCoding from './AddCoding.svelte';

	// THIS IS TEST DATA UNTIL REAL DATA IS IMPLEMENTED
	const data = {
		"DESTEP": [
            {
                title: 'DESTEP Title',
                label: '1',
            },
            {
                title: 'DESTEP Title',
                label: '2',
            },
            {
                title: 'DESTEP Title',
                label: '3',
            }
        ],
        "Major influence": [
            {
                title: 'Major influence Title',
                label: '1',
            },
            {
                title: 'Major influence Title',
                label: '2',
            },
            {
                title: 'Major influence Title',
                label: '3',
            }   
        ]
	};
</script>

<div class="mb-50">
    <h1 class="text-4xl font-bold text-light-text-primary">DESTEP</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            {#each data["DESTEP"] as item}
                <CardCodings title={item.title} label={item.label} />
            {/each}
        </div>
        <div class="h-full w-1/2">
            <AddCoding />
        </div>
    </div>

    <h1 class="text-4xl font-bold text-light-text-primary">Major influence</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            {#each data["Major influence"] as item}
                <CardCodings title={item.title} label={item.label} />
            {/each}
        </div>
        <div class="h-full w-1/2">
            <AddCoding />
        </div>
    </div>
</div>