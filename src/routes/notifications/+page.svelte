<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { User } from '../../models/user';
	import type { Notification } from '../../models/notification';
	import type { PageData } from './$types';
	import { formatRelativeTime } from '$lib/utils';
	import { deleteNotification, updateNotification } from '../../service/notification';
	import {
		navbarAllUserNotifications,
		navbarLatestUserNotifications,
		navbarNotificationsCount
	} from '../../store';

	export let data: PageData;
	const user: Writable<User | null> = writable(data.user);
	const userNotifications: Writable<Notification[]> = writable(data.userNotifications);

	const pageSize: Writable<number> = writable(10);
	const pageNumber: Writable<number> = writable(
		userNotifications ? Math.floor($userNotifications.length / $pageSize) + 1 : 1
	);
	const currentPage: Writable<number> = writable(1);
	const pageNotifications: Writable<Notification[]> = writable(
		$userNotifications ? $userNotifications.slice(0, $pageSize) : []
	);
	const notificationsFilter: Writable<string> = writable('All');

	const handleNotificationUpdate = async (notificationId: number) => {
		const payload = { seen: true };
		await updateNotification(data.notificationBaseUrl, data.token, notificationId, payload);
		// Update page Notifications state
		let notifications = [...$pageNotifications];
		notifications.filter((e) => e.id === notificationId)[0].seen = true;
		pageNotifications.set(notifications);
		// Update navbar Notifications state
		let navbarNotifications = [...$navbarAllUserNotifications];
		navbarNotifications.filter((e) => e.id === notificationId)[0].seen = true;
		navbarNotifications = navbarNotifications
			.filter((e) => !e.seen)
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.slice(0, 5);
		navbarLatestUserNotifications.set(navbarNotifications);
		navbarNotificationsCount.update((value) => value - 1);
	};

	const handleNotificationDelete = async (notificationId: number) => {
		await deleteNotification(data.notificationBaseUrl, data.token, notificationId);
		// Update page Notifications state
		console.log(notificationId);
		let notifications = [...$pageNotifications];
		notifications = notifications.filter((e) => e.id !== notificationId);
		pageNotifications.set(notifications);
		// Update all Notifications state
		let navbarNotifications = [...$navbarAllUserNotifications];
		navbarAllUserNotifications.set(navbarNotifications.filter((e) => e.id !== notificationId));
		// Update navbar Notifications state
		navbarNotifications = navbarNotifications
			.filter((e) => e.id !== notificationId)
			.filter((e) => !e.seen)
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.slice(0, 5);
		navbarLatestUserNotifications.set(navbarNotifications);
		navbarNotificationsCount.update((value) => value - 1);
	};
</script>

<div class="overflow-x-auto mx-auto w-full md:w-4/5">
	<div role="tablist" class="tabs tabs-boxed my-5">
		<button
			role="tab"
			class={`tab ${$notificationsFilter === 'All' ? 'tab-active' : ''}`}
			on:click={() => {
				notificationsFilter.set('All');
				userNotifications.set(data.userNotifications);
				pageNotifications.set(
					$userNotifications.slice(($currentPage - 1) * $pageSize, $currentPage * $pageSize)
				);
				pageNumber.set(
					userNotifications ? Math.floor($userNotifications.length / $pageSize) + 1 : 1
				);
			}}
		>
			All
		</button>
		<button
			role="tab"
			class={`tab ${$notificationsFilter !== 'All' ? 'tab-active' : ''}`}
			on:click={() => {
				notificationsFilter.set('Unread');
				userNotifications.set($userNotifications.filter((notification) => !notification.seen));
				pageNotifications.set(
					$userNotifications.slice(($currentPage - 1) * $pageSize, $currentPage * $pageSize)
				);
				pageNumber.set(
					userNotifications ? Math.floor($userNotifications.length / $pageSize) + 1 : 1
				);
			}}
		>
			Unread
		</button>
	</div>
	{#if userNotifications}
		<table class="table">
			<tbody>
				{#each $pageNotifications as notification, index (notification)}
					<tr class={`hover:bg-slate-300 transition duration-150 ease-in-out`}>
						<td>
							<div class="flex items-center gap-3 xl:w-56">
								<div class="avatar">
									<div class="mask mask-squircle w-12 h-12">
										<img
											src={`${data.gatewayBaseUrl}/${notification.userImage}`}
											alt={notification.username}
										/>
									</div>
								</div>
								<div>
									<div class="font-bold">{notification.title}</div>
									<div class="text-sm opacity-50">United States</div>
								</div>
							</div>
						</td>
						<td>
							{notification.message}
							<br />
							<span class="badge badge-primary badge-sm my-1"
								>{formatRelativeTime(notification.createdAt)}</span
							>
						</td>
						{#if !notification.seen}
							<td>
								<button
									class="btn btn-secondary btn-xs w-32"
									on:click={() => handleNotificationUpdate(notification.id)}>Mark As Read</button
								>
							</td>
						{:else}
							<td />
						{/if}
						<td>
							<button
								class="btn btn-accent btn-xs"
								on:click={() => handleNotificationDelete(notification.id)}>Delete</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="join my-10 flex justify-center">
			{#each Array.from({ length: $pageNumber }, (_, i) => i + 1) as pageIndex}
				<button
					class={`join-item btn ${
						$currentPage === pageIndex
							? 'btn-primary'
							: 'hover:bg-slate-300 transition duration-150 ease-in-out'
					}`}
					on:click={() => {
						currentPage.set(pageIndex);
						pageNotifications.set(
							$userNotifications.slice((pageIndex - 1) * $pageSize, pageIndex * $pageSize)
						);
					}}>{pageIndex}</button
				>
			{/each}
		</div>
	{:else}
		<div>
			<h1 class="text-center text-2xl font-extrabold">No Notifications were found</h1>
		</div>
	{/if}
</div>
