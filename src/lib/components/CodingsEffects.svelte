<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";

    // THIS IS TEST DATA UNTIL REAL DATA IS IMPLEMENTED
    const effectsData = [
        {
            title: 'Effects Title',
            label: '1',
            children: [
                {
                    title: 'Effects Title',
                    label: '2',
                },
                {
                    title: 'Effects Title',
                    label: '3',
                }
            ],
        },
        {
            title: 'Effects Title',
            label: '4',
            children: [
                {
                    title: 'Effects Title',
                    label: '5',
                },
                {
                    title: 'Effects Title',
                    label: '6',
                }
            ],
        }
    ];
</script>

<div class="mb-50">
    <h1 class="text-4xl font-bold text-light-text-primary">Effects</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">N1</h2>
            {#each effectsData as effect}
                <TreeCodings data={effect} />
            {/each}
        </div>
        <div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">Add N1 Effect</h2>
            <AddCoding />
        </div>
    </div>
</div>
