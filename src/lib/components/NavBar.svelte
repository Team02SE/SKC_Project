<script>
  import { page } from '$app/stores';
</script>

<nav class="bg-white px-6 py-3 flex items-center shadow-md">
  <!-- Left section: nav links -->
  <ul class="ml-24 flex gap-6">
    <li class={$page.url.pathname === '/' ? 'border-b-3 border-orange-500' : ''}>
      <a href="/" class="text-gray-700 text-2xl font-semibold {$page.url.pathname === '/' ? 'text-orange-500' : ''}">
        Workflows
      </a>
    </li>
    <li class={$page.url.pathname.startsWith('/codings') ? 'border-b-3 border-orange-500' : ''}>
      <a href="/codings" class="text-gray-700 text-2xl font-semibold {$page.url.pathname.startsWith('/codings') ? 'text-orange-500' : ''}">
        Codings
      </a>
    </li>
    <li class={$page.url.pathname.startsWith('/dashboard') ? 'border-b-3 border-orange-500' : ''}>
      <a href="/dashboard" class="text-gray-700 text-2xl font-semibold {$page.url.pathname.startsWith('/dashboard') ? 'text-orange-500' : ''}">
        Dashboard
      </a>
    </li>
  </ul>

  <!-- Middle spacer -->
  <div class="flex-grow"></div>

  <!-- Right button -->
  <div class="mr-24">
    <button class="bg-orange-400 text-white px-4 py-1.5 rounded-2xl text-xl font-semibold active:bg-orange-500 transition hover:cursor-pointer">
      Upload
    </button>
  </div>
</nav>