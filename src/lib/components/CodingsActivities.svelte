<script lang="ts">
    import TreeCodings from "./TreeCodings.svelte";
    import AddCoding from "./AddCoding.svelte";

    // THIS IS TEST DATA UNTIL REAL DATA IS IMPLEMENTED
    const activitiesData = [
        {
            title: 'Activity Title',
            label: '1',
            children: [
                {
                    title: 'Sub-activity 1',
                    label: '1.1',
                    buttonIcon: 'close'
                },
                {
                    title: 'Sub-activity 2',
                    label: '1.2',
                    buttonIcon: 'close'
                },
                {
                    title: 'Sub-activity 3',
                    label: '1.3',
                    buttonIcon: 'close'
                }
            ],
        },
        {
            title: 'Activity Title',
            label: '2',
            children: [
                {
                    title: 'Sub-activity 1',
                    label: '2.1',
                    buttonIcon: 'close'
                },
                {
                    title: 'Sub-activity 2',
                    label: '2.2',
                    buttonIcon: 'close'
                }
            ],
        }
    ];
</script>

<div class="mb-50">
    <h1 class="text-4xl font-bold text-light-text-primary">Activities</h1>
    <div class="flex h-full w-full gap-30">
        <div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">N1</h2>
            {#each activitiesData as activity}
            <TreeCodings data={activity} />
            {/each}
        </div>
        
        <div class="h-full w-1/2">
            <h2 class="mb-2 text-2xl font-semibold text-light-text-primary">Add N1 Activity</h2>
            <AddCoding />
        </div>
    </div>
</div>