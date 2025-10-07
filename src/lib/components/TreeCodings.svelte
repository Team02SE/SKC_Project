<script>
    import CardCodings from "./CardCodings.svelte";
</script>

<div class="flex h-auto w-full flex-col gap-3 mb-10">
    <CardCodings title="Activity Title" label="1"/>    
    <div class="ml-5">
        <p class="text-sm italic font-semibold text-light-text-primary/50">Sub-activities</p>
        <div class="flex flex-col gap-2 mt-2">
            <CardCodings title="Sub-activity 1" label="1.1" buttonIcon="close"/>
            <CardCodings title="Sub-activity 2" label="1.2" buttonIcon="close"/>
            <CardCodings title="Sub-activity 3" label="1.3" buttonIcon="close"/>
        </div>
    </div>
</div>