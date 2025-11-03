<script>
  let open = false;
</script>

<div class="relative inline-block text-left">
  <button
    on:click={() => open = !open}
    class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/5 hover:bg-white/20"
  >
    Filter
    <svg viewBox="0 0 20 20" fill="currentColor" class="-mr-1 size-5 text-gray-400">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
      />
    </svg>
  </button>

  {#if open}
    <div
      class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-white/10 focus:outline-none"
    >
      <div class="py-1">
        <!-- add an arrow pointing up or down for sorting -->
        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
          Alphabetically
        </a>
        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
          Last Modified
        </a>
        <!-- add an arrow pointing up or down for sorting -->
        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
          Date
        </a>
      </div>
    </div>
  {/if}
</div>
