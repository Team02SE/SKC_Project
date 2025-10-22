<script>
  import skcLogo from '$lib/assets/SKC-logo.png';
  import profile from '$lib/assets/profile.svg';
  import NavBar from './NavBar.svelte';
</script>

<header class="bg-light-navbar-primary w-full flex flex-col">
  <!-- Top row: logo and profile -->
  <div class="flex justify-between items-center h-20 px-4">
<a href="/">
  <img src={skcLogo} alt="Logo" class="w-30 h-30 drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]"/>
</a>    <img src={profile} alt="Profile" class="w-12 h-12"/>
  </div>
  <!-- Bottom row: NavBar -->
    <NavBar />
</header>