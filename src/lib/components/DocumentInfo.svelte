<script>
  export let title = "Document.pdf";
  export let author = "QiZhang";
  export let date = "05.05.2005";

  import PDFView from './PDFView.svelte';
  import MetaView from './MetaView.svelte';
  import Toggle from '$lib/components/Toggle.svelte';

  let showDocument = true; // true = Document, false = Metadata
</script>

<div class="w-full h-full bg-light-primary rounded-t-2xl shadow-md border border-gray-200 inset-shadow-sm/25 flex flex-col">
  <!-- Header Section -->
  <div class="relative flex justify-center items-center px-6 py-4 flex-shrink-0">
  
    <!-- Left: Big title -->
    <div class="absolute left-10 text-4xl font-bold text-gray-800">
      {title}
    </div>

    <!-- Center: Author and Date -->
    <div class="text-left">
      <div class="text-sm text-gray-600">
        Author: <span class="font-medium text-gray-800">{author}</span>
      </div>
      <div class="text-sm text-gray-600">
        Published: <span class="font-medium text-gray-800">{date}</span>
      </div>
    </div>

    <!-- Right: Toggle component -->
    <div class="absolute right-6">
      <Toggle bind:checked={showDocument} labelOff="Metadata" labelOn="Document" />
    </div>
  </div>


  <!-- Bottom Section -->
  <div class="flex-1 flex flex-col p-10 pt-5 pr-20 overflow-hidden">
    <div class="flex-1 w-full bg-gray-200 border border-gray-200 rounded-2xl p-4 overflow-hidden">
      {#if showDocument}
        <PDFView />
      {:else}
        <MetaView />
      {/if}
    </div>
  </div>
</div>