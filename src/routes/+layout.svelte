<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import type { Notification } from '../models/notification';
	import { updateNotification } from '../service/notification';
	import { goto } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	import type { User } from '../models/user';
	import Cookies from 'js-cookie';
	import {
		navbarNotificationsCount,
		navbarLatestUserNotifications,
		navbarOfferItemsNumber,
		navbarOfferItemsValue,
		navbarIsLogin
	} from '../store';
	import { io } from 'socket.io-client';

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
	navbarOfferItemsNumber.set(offerItemsNumber);
	navbarOfferItemsValue.set(offerItemsValue);

	const formatRelativeTime = (dateString: string | Date) => {
		const inputDate = new Date(dateString);
		const currentDate = new Date();

		const timeDifference = currentDate - inputDate;
		const secondsDifference = Math.floor(timeDifference / 1000);
		const minutesDifference = Math.floor(secondsDifference / 60);
		const hoursDifference = Math.floor(minutesDifference / 60);
		const daysDifference = Math.floor(hoursDifference / 24);
		const monthsDifference = Math.floor(daysDifference / 30.44);
		const yearsDifference = Math.floor(monthsDifference / 12);

		if (yearsDifference > 0) {
			return `${yearsDifference} year${yearsDifference !== 1 ? 's' : ''} ago`;
		} else if (monthsDifference > 0) {
			return `${monthsDifference} month${monthsDifference !== 1 ? 's' : ''} ago`;
		} else if (daysDifference > 0) {
			return `${daysDifference} day${daysDifference !== 1 ? 's' : ''} ago`;
		} else if (hoursDifference > 0) {
			return `${hoursDifference} hour${hoursDifference !== 1 ? 's' : ''} ago`;
		} else if (minutesDifference > 0) {
			return `${minutesDifference} minute${minutesDifference !== 1 ? 's' : ''} ago`;
		} else {
			return `${secondsDifference} second${secondsDifference !== 1 ? 's' : ''} ago`;
		}
	};

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
	});
</script>

<!-- Navbar -->
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
							<!-- Notifications icons with unread notif number and notifs dropdown (show last 5 notifs with unread priority , unread one have text font bold / on hover patch to seen to true) -->
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
							<li class="btn btn-ghost"><a href="/">See all</a></li>
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
