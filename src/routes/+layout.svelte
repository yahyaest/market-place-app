<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { getCurrentUserAvatar } from '../service/gateway';

	export let data;

	const  userImage = data.userImage;
	const gatewayBaseUrl = data.gatewayBaseUrl;

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});
</script>

<div class="navbar sticky top-0 z-50 bg-red-500 mb-10">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">MarketPlace</a>
	</div>

	<div class="flex-none gap-2">
		<div class="form-control">
			<input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
		</div>

		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<li>
					<details>
						<summary> Theme </summary>
						<ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
							<li data-set-theme="dark"><a>Dark</a></li>
							<li data-set-theme="night"><a>Night</a></li>
							<li data-set-theme="coffee"><a>Coffee</a></li>
							<li data-set-theme="light"><a>Light</a></li>
							<li data-set-theme="cupcake"><a>Cupcake</a></li>
							<li data-set-theme="luxury"><a>Luxury</a></li>
							<li data-set-theme="retro"><a>Retro</a></li>
							<li data-set-theme="aqua"><a>Aqua</a></li>
							<li data-set-theme="synthwave"><a>Synthwave</a></li>
						</ul>
					</details>
				</li>
			</ul>
		</div>

		<div class="flex-none">
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="btn btn-ghost btn-circle">
					<div class="indicator">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
							/></svg
						>
						<!-- <span class="badge badge-sm indicator-item">8</span> -->
						<span class="badge badge-xs badge-primary indicator-item" />
					</div>
				</label>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<div
					tabindex="0"
					class="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
				>
					<div class="card-body">
						<span class="font-bold text-lg">8 Items</span>
						<span class="text-info">Subtotal: $999</span>
						<div class="card-actions">
							<button class="btn btn-primary btn-block">View cart</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex-none">
			<ul class="dropdown dropdown-end">
				<li>
					<label class="btn btn-ghost btn-circle">
						<button>
							<div class="indicator">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
									/></svg
								>
								<span class="badge badge-sm indicator-item">8</span>
							</div>
						</button>
					</label>
					<ul
						class="mt-3 ml-10 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-96"
					>
						<!-- Notifications icons with unread notif number and notifs dropdown (show last 5 notifs with unread priority , unread one have text font bold / on hover patch to seen to true) -->
						<li>
							<div class="flex flex-row justify-between">
								<img
									class="btn btn-ghost btn-circle avatar"
									src={`${gatewayBaseUrl}/${userImage}`}
									alt={userImage}
								/>
								<div>
									<h3>Notif Username - Notif Title</h3>
									<p>Notif Message</p>
								</div>
								<span>2w</span>
							</div>
						</li>
						<li class="btn btn-ghost"><a href="/">See all</a></li>
					</ul>
				</li>
			</ul>
		</div>

		{#if data.user}
			<div class="flex-none">
				<ul class="dropdown dropdown-end">
					<li>
						<details>
							<summary class="btn btn-ghost btn-circle avatar">
								<div class="w-10 rounded-full">
									<img src={`${gatewayBaseUrl}/${userImage}`} alt={userImage} />
								</div>
							</summary>
							<ul
								class="mt-3 ml-10 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
							>
								<li>
									<a href="/" class="justify-between">
										Profile
										<span class="badge">New</span>
									</a>
								</li>
								<li><a href="/">Settings</a></li>
								<li><a href="/">Offers</a></li>
								<li><a href="/">Logout</a></li>
							</ul>
						</details>
					</li>
				</ul>
			</div>
		{:else}
			<button class="btn btn-outline btn-sm">Login</button>
		{/if}
	</div>
</div>

<!-- <select data-choose-theme>
	<option value="">Default</option>
	<option value="dark">Dark</option>
	<option value="night">Night</option>
	<option value="coffe">Coffe</option>
	<option value="light">Light</option>
	<option value="cupcake">Cupcake</option>
	<option value="luxury">Luxury</option>
</select> -->

<slot />
