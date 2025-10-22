<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';

	let currentTheme = $state('light');
	let currentAccentColor = $state('#F8851C'); // Default orange

	// Password change form
	let passwordForm = $state({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});
	let passwordErrors = $state<string[]>([]);
	let passwordSuccess = $state(false);

	// Logout confirmation
	let showLogoutConfirm = $state(false);

	// Available accent colors
	const accentColors = [
		{ name: 'Orange', value: '#F8851C' },
		{ name: 'Blue', value: '#01699B' },
		{ name: 'Green', value: '#10B981' },
		{ name: 'Purple', value: '#8B5CF6' },
		{ name: 'Red', value: '#EF4444' },
		{ name: 'Pink', value: '#EC4899' },
		{ name: 'Teal', value: '#14B8A6' },
		{ name: 'Indigo', value: '#6366F1' }
	];

	onMount(() => {
		// Load saved theme and accent color
		const savedTheme = localStorage.getItem('theme') || 'light';
		const savedAccentColor = localStorage.getItem('accentColor') || '#F8851C';
		
		currentTheme = savedTheme;
		currentAccentColor = savedAccentColor;
		
		applyTheme();
		applyAccentColor();
	});

	function applyTheme() {
		document.documentElement.setAttribute('data-theme', currentTheme);
		localStorage.setItem('theme', currentTheme);
	}

	function applyAccentColor() {
		document.documentElement.style.setProperty('--color-light-active-primary', currentAccentColor);
		localStorage.setItem('accentColor', currentAccentColor);
	}

	function toggleTheme() {
		currentTheme = currentTheme === 'light' ? 'dark' : 'light';
		applyTheme();
	}

	function changeAccentColor(color: string) {
		currentAccentColor = color;
		applyAccentColor();
	}

	function validatePassword() {
		passwordErrors = [];
		
		if (!passwordForm.currentPassword) {
			passwordErrors.push('Current password is required');
		}
		
		if (!passwordForm.newPassword) {
			passwordErrors.push('New password is required');
		} else if (passwordForm.newPassword.length < 8) {
			passwordErrors.push('New password must be at least 8 characters long');
		}
		
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			passwordErrors.push('New passwords do not match');
		}
		
		if (passwordForm.currentPassword === passwordForm.newPassword) {
			passwordErrors.push('New password must be different from current password');
		}
		
		return passwordErrors.length === 0;
	}

	function handlePasswordChange() {
		if (validatePassword()) {
			// Simulate password change (in real app, this would make an API call)
			console.log('Password change request:', {
				currentPassword: passwordForm.currentPassword,
				newPassword: passwordForm.newPassword
			});
			
			passwordSuccess = true;
			passwordForm = {
				currentPassword: '',
				newPassword: '',
				confirmPassword: ''
			};
			
			// Hide success message after 3 seconds
			setTimeout(() => {
				passwordSuccess = false;
			}, 3000);
		}
	}

	function handleLogout() {
		// Simulate logout (in real app, this would clear auth tokens and redirect)
		console.log('User logged out');
		goto('/');
	}

	function confirmLogout() {
		showLogoutConfirm = true;
	}

	function cancelLogout() {
		showLogoutConfirm = false;
	}
</script>

<Header />

<main class="ml-20 min-h-screen">
	<div class="max-w-4xl mx-auto p-8">
		<div class="mb-8">
			<h1 class="text-4xl font-bold mb-2" style="color: var(--color-light-text-primary);">Profile Settings</h1>
			<p class="text-lg" style="color: var(--color-light-text-primary); opacity: 0.7;">Manage your account preferences and security settings</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div class="bg-white rounded-xl shadow-sm p-6">
				<div class="flex items-center mb-6">
					<div class="w-12 h-12 rounded-full flex items-center justify-center mr-4" style="background-color: var(--color-light-active-primary);">
						<svg class="w-6 h-6" style="color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
						</svg>
					</div>
					<div>
						<h2 class="text-xl font-semibold" style="color: var(--color-light-text-primary);">Security</h2>
						<p class="text-sm" style="color: var(--color-light-text-primary); opacity: 0.7;">Change your password</p>
					</div>
				</div>

				{#if passwordSuccess}
					<div class="mb-4 p-4 rounded-lg" style="background-color: #D1FAE5; color: #065F46;">
						<div class="flex items-center">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
							</svg>
							Password changed successfully!
						</div>
					</div>
				{/if}

				{#if passwordErrors.length > 0}
					<div class="mb-4 p-4 rounded-lg" style="background-color: #FEE2E2; color: #991B1B;">
						<div class="flex items-start">
							<svg class="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
							</svg>
							<div>
								<p class="font-medium">Please fix the following errors:</p>
								<ul class="mt-1 list-disc list-inside">
									{#each passwordErrors as error}
										<li>{error}</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				{/if}

				<form onsubmit={(e) => { e.preventDefault(); handlePasswordChange(); }} class="space-y-4">
					<div>
						<label for="currentPassword" class="block text-sm font-medium mb-2" style="color: var(--color-light-text-primary);">Current Password</label>
						<input
							type="password"
							id="currentPassword"
							bind:value={passwordForm.currentPassword}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all duration-200"
							style="focus:ring-color: var(--color-light-active-primary);"
							placeholder="Enter current password"
						/>
					</div>

					<div>
						<label for="newPassword" class="block text-sm font-medium mb-2" style="color: var(--color-light-text-primary);">New Password</label>
						<input
							type="password"
							id="newPassword"
							bind:value={passwordForm.newPassword}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all duration-200"
							style="focus:ring-color: var(--color-light-active-primary);"
							placeholder="Enter new password"
						/>
					</div>

					<div>
						<label for="confirmPassword" class="block text-sm font-medium mb-2" style="color: var(--color-light-text-primary);">Confirm New Password</label>
						<input
							type="password"
							id="confirmPassword"
							bind:value={passwordForm.confirmPassword}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all duration-200"
							style="focus:ring-color: var(--color-light-active-primary);"
							placeholder="Confirm new password"
						/>
					</div>

					<button
						type="submit"
						class="w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
						style="background-color: var(--color-light-active-primary); color: var(--color-light-button-content-primary);"
					>
						Change Password
					</button>
				</form>
			</div>

			<div class="bg-white rounded-xl shadow-sm p-6">
				<div class="flex items-center mb-6">
					<div class="w-12 h-12 rounded-full flex items-center justify-center mr-4" style="background-color: var(--color-light-active-primary);">
						<svg class="w-6 h-6" style="color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
						</svg>
					</div>
					<div>
						<h2 class="text-xl font-semibold" style="color: var(--color-light-text-primary);">Appearance</h2>
						<p class="text-sm" style="color: var(--color-light-text-primary); opacity: 0.7;">Customize your theme and colors</p>
					</div>
				</div>

				<!-- Theme Toggle -->
				<div class="mb-6">
					<div class="block text-sm font-medium mb-3" style="color: var(--color-light-text-primary);">Theme</div>
					<div class="flex items-center space-x-4">
						<button
							onclick={() => { currentTheme = 'light'; applyTheme(); }}
							class="flex items-center px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 cursor-pointer"
							class:border-orange-500={currentTheme === 'light'}
							class:bg-orange-50={currentTheme === 'light'}
							class:border-gray-300={currentTheme !== 'light'}
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
							</svg>
							Light
						</button>
						<button
							onclick={() => { currentTheme = 'dark'; applyTheme(); }}
							class="flex items-center px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 cursor-pointer"
							class:border-orange-500={currentTheme === 'dark'}
							class:bg-orange-50={currentTheme === 'dark'}
							class:border-gray-300={currentTheme !== 'dark'}
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
							</svg>
							Dark
						</button>
					</div>
				</div>

				<!-- Accent Color Picker -->
				<div>
					<div class="block text-sm font-medium mb-3" style="color: var(--color-light-text-primary);">Accent Color</div>
					<div class="grid grid-cols-4 gap-3">
						{#each accentColors as color}
							<button
								onclick={() => changeAccentColor(color.value)}
								class="w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 focus:outline-none"
								class:border-gray-800={currentAccentColor === color.value}
								class:border-gray-300={currentAccentColor !== color.value}
								style="background-color: {color.value};"
								title={color.name}
								aria-label="Set {color.name} as accent color"
							></button>
						{/each}
					</div>
					<p class="text-xs mt-2" style="color: var(--color-light-text-primary); opacity: 0.6;">Click a color to set it as your accent color</p>
				</div>
			</div>

			<div class="rounded-xl p-6 lg:col-span-2">
				<div class="flex flex-col sm:flex-row-reverse gap-4 flex-">
					<button
						onclick={confirmLogout}
						class="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
						style="background-color: #EF4444; color: white;"
					>
						<svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
						</svg>
						Log Out
					</button>
				</div>
			</div>
		</div>
	</div>
</main>

{#if showLogoutConfirm}
	<div class="fixed inset-0 flex items-center justify-center drop-shadow-xl/50" style="background-color: rgba(0,0,0,0.5)">
		<div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
			<div class="flex items-center mb-4">
				<div class="w-12 h-12 rounded-full flex items-center justify-center mr-4" style="background-color: #EF4444;">
					<svg class="w-6 h-6" style="color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
					</svg>
				</div>
				<div>
					<h3 class="text-lg font-semibold" style="color: var(--color-light-text-primary);">Confirm Logout</h3>
					<p class="text-sm" style="color: var(--color-light-text-primary); opacity: 0.7;">Are you sure you want to log out?</p>
				</div>
			</div>
			
			<div class="flex gap-3 justify-end">
				<button
					onclick={cancelLogout}
					class="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
					style="background-color: var(--color-light-secondary); color: var(--color-light-button-content-primary);"
				>
					Cancel
				</button>
				<button
					onclick={handleLogout}
					class="px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none cursor-pointer"
					style="background-color: #EF4444; color: white;"
				>
					Log Out
				</button>
			</div>
		</div>
	</div>
{/if}

