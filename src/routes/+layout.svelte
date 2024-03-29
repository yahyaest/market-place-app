<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import type { Notification } from '../models/notification';
	import { updateNotification } from '../service/notification';
	import { goto } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	import type { User } from '../models/user';
	import type { Product } from '../models/product';
	import Cookies from 'js-cookie';
	import {
		navbarNotificationsCount,
		navbarLatestUserNotifications,
		navbarOfferItemsNumber,
		navbarOfferItemsValue,
		navbarIsLogin,
		navbarAllUserNotifications
	} from '../store';
	import { io } from 'socket.io-client';
	import { formatRelativeTime } from '$lib/utils';
	import axios from 'axios';

	const socket = io();

	socket.on('updateNavbarNotificatinsFromServer', (data) => {
		if (data && data.toUser === $user?.email) {
			navbarNotificationsCount.update((value) => value + data.notificationNumberToAdd);
			let notifications = [...$navbarLatestUserNotifications];
			notifications.pop();
			notifications.unshift(data.notification);
			navbarLatestUserNotifications.set(notifications);
		}
	});

	// socket.on('eventFromServer', (message) => {
	// 	console.log(message);
	// });

	export let data;
	const user: Writable<User | null> = writable(data.user);

	const gatewayBaseUrl = data.gatewayBaseUrl;
	const notificationBaseUrl = data.notificationBaseUrl;
	const userImage = data.userImage;
	const latestUserNotifications: Notification[] = data.latestUserNotifications;
	const notificationsNumber = data.notificationsNumber;
	const offerItemsNumber = data.offerItemsNumber;
	const offerItemsValue = data.offerItemsValue;

	navbarIsLogin.set($user ? true : false);
	navbarNotificationsCount.set(notificationsNumber);
	navbarLatestUserNotifications.set(latestUserNotifications);
	navbarAllUserNotifications.set(data.allUserNotifications);
	navbarOfferItemsNumber.set(offerItemsNumber);
	navbarOfferItemsValue.set(offerItemsValue);
	let formControl: any;
	const searchQuery: Writable<string> = writable('');
	const showSearchDropdown: Writable<boolean> = writable(false);
	const productsSearchResult: Writable<Product[]> = writable([]);
	const productsSearchCount: Writable<number> = writable(0);

	const handleNotificationMouseOver = async (
		notificationId: number,
		notificationIsHovered: boolean | undefined
	) => {
		if (!notificationIsHovered) {
			const payload = { seen: true };
			await updateNotification(notificationBaseUrl, data.token, notificationId, payload);
			let notifications = [...$navbarLatestUserNotifications];
			notifications.filter((e) => e.id === notificationId)[0].seen = true;
			navbarLatestUserNotifications.set(notifications);
			navbarNotificationsCount.update((value) => value - 1);
		}
	};

	const handleNotificationMouseOut = async (
		notificationId: number,
		notificationIsHovered: boolean | undefined
	) => {
		if (!notificationIsHovered) {
			let notifications = [...$navbarLatestUserNotifications];
			notifications.filter((e) => e.id === notificationId)[0].isHovered = true;
			navbarLatestUserNotifications.set(notifications);
		}
	};

	const logout = () => {
		Cookies.remove('user');
		Cookies.remove('token');
		user.set(null);
		navbarIsLogin.set(false);
		goto('/');
	};

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
		const handleClickOutside = (event: MouseEvent) => {
			if (formControl && !formControl.contains(event.target)) {
				showSearchDropdown.set(false);
			}
		};

		window.addEventListener('click', handleClickOutside);

		return () => {
			window.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<!-- Navbar -->
<div class="navbar sticky top-0 z-50 bg-red-500 mb-10">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">MarketPlace</a>
	</div>

	<div class="flex-none gap-2">
		<div
			class="form-control"
			bind:this={formControl}
			on:click|stopPropagation
			on:keydown={() => {}}
			role="button"
			tabindex="0"
		>
			<div class="relative">
				<input
					type="text"
					placeholder="Search"
					class="input input-bordered w-24 md:w-auto"
					on:input={async (e) => {
						showSearchDropdown.set(true);
						searchQuery.set(e.target?.value);
						const response = await axios.get(
							`/api/products_search?search_query=${e.target?.value}`
						);
						productsSearchResult.set(response.data.products);
						productsSearchCount.set(response.data.products.length);
					}}
				/>
				{#if $showSearchDropdown && $searchQuery.length > 0}
					<ul
						class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-[32rem] absolute top-full left-0"
					>
						{#each $productsSearchResult.splice(0, 5) as product, index (product)}
							<li>
								<div
									class="flex flex-row justify-between"
									on:click={() => window.location.replace(`/products/${product.slug}`)}
									on:keydown={() => {}}
									role="button"
									tabindex="0"
								>
									<img
										class="btn btn-ghost btn-circle avatar"
										src={`${product.imageUrl}`}
										alt={product.imageUrl}
									/>
									<p class="text-xs font-semibold text-center">{product.title}</p>
									<span class="badge badge-md badge-primary text-xs flex">
										<p>{product.price}</p>
										&nbsp;
										<p>TND</p>
									</span>
								</div>
							</li>
						{/each}
						<button
							class="text-center text-md font-bold my-1"
							on:click={() => window.location.replace(`/search/${$searchQuery}`)}
							on:keydown={() => {}}
						>
							See all {$productsSearchCount} search results for {$searchQuery}
						</button>
					</ul>
				{/if}
			</div>
		</div>

		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<li>
					<details>
						<summary> Theme </summary>
						<ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
							<li data-set-theme="dark"><div>Dark</div></li>
							<li data-set-theme="night"><div>Night</div></li>
							<li data-set-theme="coffee"><div>Coffee</div></li>
							<li data-set-theme="light"><div>Light</div></li>
							<li data-set-theme="cupcake"><div>Cupcake</div></li>
							<li data-set-theme="luxury"><div>Luxury</div></li>
							<li data-set-theme="retro"><div>Retro</div></li>
							<li data-set-theme="aqua"><div>Aqua</div></li>
							<li data-set-theme="synthwave"><div>Synthwave</div></li>
							<li data-set-theme="cyberpunk"><div>Cyberpunk</div></li>
						</ul>
					</details>
				</li>
			</ul>
		</div>

		{#if $navbarIsLogin}
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
							<span class="font-bold text-lg">{$navbarOfferItemsNumber} Items</span>
							<span class="text-info">Subtotal: {$navbarOfferItemsValue} TND</span>
							<div class="card-actions">
								<button class="btn btn-primary btn-block" on:click={() => goto('/cart')}
									>View cart</button
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if $navbarIsLogin}
			<div class="flex-none">
				<ul class="dropdown dropdown-end">
					<li>
						<label class="btn btn-ghost btn-circle">
							<button on:click={() => goto('/store')}>
								<div class="indicator">
									<svg
										class="w-5 h-5 text-gray-800 dark:text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											d="M17.876.517A1 1 0 0 0 17 0H3a1 1 0 0 0-.871.508C1.63 1.393 0 5.385 0 6.75a3.236 3.236 0 0 0 1 2.336V19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.044a3.242 3.242 0 0 0 1-2.294c0-1.283-1.626-5.33-2.124-6.233ZM15.5 14.7a.8.8 0 0 1-.8.8h-2.4a.8.8 0 0 1-.8-.8v-2.4a.8.8 0 0 1 .8-.8h2.4a.8.8 0 0 1 .8.8v2.4ZM16.75 8a1.252 1.252 0 0 1-1.25-1.25 1 1 0 0 0-2 0 1.25 1.25 0 0 1-2.5 0 1 1 0 0 0-2 0 1.25 1.25 0 0 1-2.5 0 1 1 0 0 0-2 0A1.252 1.252 0 0 1 3.25 8 1.266 1.266 0 0 1 2 6.75C2.306 5.1 2.841 3.501 3.591 2H16.4A19.015 19.015 0 0 1 18 6.75 1.337 1.337 0 0 1 16.75 8Z"
										/>
									</svg>
								</div>
							</button>
						</label>
					</li>
				</ul>
			</div>
		{/if}

		{#if $navbarIsLogin}
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
									{#if $navbarNotificationsCount < 100}
										<span class="badge badge-sm indicator-item">{$navbarNotificationsCount}</span>
									{:else}
										<span class="badge badge-sm indicator-item">+99</span>
									{/if}
								</div>
							</button>
						</label>
						<ul
							class="mt-3 ml-10 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-[32rem]"
						>
							{#if $navbarLatestUserNotifications}
								{#each $navbarLatestUserNotifications as notification}
									<li
										on:mouseover={() => {
											if (!notification.seen) {
												handleNotificationMouseOver(notification.id, notification.isHovered);
											}
										}}
										on:mouseout={() => {
											if (!notification.seen) {
												handleNotificationMouseOut(notification.id, notification.isHovered);
											}
										}}
										on:focus={() => {}}
										on:blur={() => {}}
									>
										<div class="flex flex-row justify-between">
											<img
												class="btn btn-ghost btn-circle avatar"
												src={`${gatewayBaseUrl}/${notification.userImage}`}
												alt={notification.userImage}
											/>
											<div class="w-80">
												<h3 class="text-lg text-center font-bold mb-2">{notification.title}</h3>
												<p class="ml-8 text-xs">{notification.message}</p>
											</div>
											<span class="w-20 text-xs">{formatRelativeTime(notification.createdAt)}</span>
											{#if !notification.seen}
												<span class="badge badge-xs badge-primary indicator-item" />
											{/if}
										</div>
									</li>
								{/each}
							{/if}
							<li class="btn btn-ghost">
								<button class="w-full flex justify-center" on:click={() => goto(`/notifications`)}>
									<p>See All</p>
								</button>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		{/if}

		{#if $navbarIsLogin}
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
								<li><button on:click={logout}>Logout</button></li>
							</ul>
						</details>
					</li>
				</ul>
			</div>
		{:else}
			<button class="btn btn-outline btn-sm" on:click={() => goto('/auth/login')}>Login</button>
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
