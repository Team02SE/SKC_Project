<script>
  import skcLogo from '$lib/assets/SKC-logo.png';
  import profile from '$lib/assets/profile.svg';
  import NavBar from './NavBar.svelte';
</script>

<!-- change color of bg to predefined colors -->
<header class="bg-light-navbar-primary h-20 w-full flex justify-between">
    <img src={skcLogo} alt="Logo" class="w-30 h-30"/>
    <img src={profile} alt="Profile" href="/profile" class="w-12 h-12 mt-4 mr-10"/>
</header>