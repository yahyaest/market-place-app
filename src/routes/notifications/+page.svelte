<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { User } from '../../models/user';
	import type { Notification } from '../../models/notification';
	import type { PageData } from './$types';
	import { formatRelativeTime } from '$lib/utils';
	import {
		deleteNotification,
		getUserNotifications,
		updateBulkNotification,
		updateNotification
	} from '../../service/notification';
	import {
		navbarAllUserNotifications,
		navbarLatestUserNotifications,
		navbarNotificationsCount
	} from '../../store';

	export let data: PageData;
	const setPageNumber = (data: any[]) => {
		return data
			? (data.length / $pageSize) % 1 === 0
				? Math.floor(data.length / $pageSize)
				: Math.floor(data.length / $pageSize) + 1
			: 1;
	};

	const user: User = data.user;
	const userNotifications: Writable<Notification[]> = writable(data.userNotifications);

	const pageSize: Writable<number> = writable(10);
	const pageNumber: Writable<number> = writable(setPageNumber($userNotifications));
	const currentPage: Writable<number> = writable(1);
	const pageNotifications: Writable<Notification[]> = writable(
		$userNotifications ? $userNotifications.slice(0, $pageSize) : []
	);
	const notificationsFilter: Writable<string> = writable('All');

	const handleNotificationUpdate = async (notificationId: number) => {
		// api call
		const payload = { seen: true };
		await updateNotification(data.notificationBaseUrl, data.token, notificationId, payload);
		let notificationsResponse = await getUserNotifications(
			data.notificationBaseUrl,
			data.token,
			user.email
		);
		notificationsResponse.sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt));
		// Update page Notifications state
		userNotifications.set(notificationsResponse);
		let notifications = [...$pageNotifications];
		notifications.filter((e) => e.id === notificationId)[0].seen = true;
		pageNotifications.set(notifications);
		if ($notificationsFilter === 'Unread') {
			userNotifications.set(notificationsResponse.filter((e: any) => !e.seen));
			pageNumber.set(setPageNumber($userNotifications));
			if ($currentPage > $pageNumber) {
				currentPage.set($pageNumber);
			}
			pageNotifications.set(
				$userNotifications.slice(($currentPage - 1) * $pageSize, $currentPage * $pageSize)
			);
		}
		// Update navbar Notifications state
		const navbarNotifications = $userNotifications
			.filter((e) => !e.seen)
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.slice(0, 5);
		navbarLatestUserNotifications.set(navbarNotifications);
		navbarNotificationsCount.update((value) => value - 1);
	};

	const handleNotificationDelete = async (notificationId: number) => {
		const isUnreadNotification = $userNotifications.filter((e) => e.id === notificationId)[0].seen;
		// api call
		await deleteNotification(data.notificationBaseUrl, data.token, notificationId);
		let notificationsResponse = await getUserNotifications(
			data.notificationBaseUrl,
			data.token,
			user.email
		);
		notificationsResponse.sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt));
		// Update page Notifications state
		userNotifications.set(notificationsResponse);
		pageNumber.set(setPageNumber($userNotifications));
		if ($currentPage > $pageNumber) {
			currentPage.set($pageNumber);
		}
		pageNotifications.set(
			$userNotifications.slice(($currentPage - 1) * $pageSize, $currentPage * $pageSize)
		);
		// Update navbar Notifications state
		const navbarNotifications = $userNotifications
			.filter((e) => e.id !== notificationId)
			.filter((e) => !e.seen)
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.slice(0, 5);
		navbarLatestUserNotifications.set(navbarNotifications);
		if (!isUnreadNotification) {
			navbarNotificationsCount.update((value) => value - 1);
		}
	};
</script>

<div class="overflow-x-auto mx-auto w-full md:w-4/5">
	<div role="tablist" class="tabs tabs-boxed my-5">
		<button
			role="tab"
			class={`tab ${$notificationsFilter === 'All' ? 'tab-active' : ''}`}
			on:click={async () => {
				notificationsFilter.set('All');
				// api call
				let notificationsResponse = await getUserNotifications(
					data.notificationBaseUrl,
					data.token,
					user.email
				);
				notificationsResponse.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				// Update page Notifications state
				userNotifications.set(notificationsResponse);
				pageNotifications.set(
					$userNotifications.slice(($currentPage - 1) * $pageSize, $currentPage * $pageSize)
				);
				pageNumber.set(setPageNumber($userNotifications));
			}}
		>
			All
		</button>
		<button
			role="tab"
			class={`tab ${$notificationsFilter !== 'All' ? 'tab-active' : ''}`}
			on:click={() => {
				// Update page Notifications state
				notificationsFilter.set('Unread');
				if ($userNotifications && $userNotifications.filter((e) => !e.seen).length > 0) {
					userNotifications.set($userNotifications.filter((notification) => !notification.seen));
					pageNumber.set(setPageNumber($userNotifications));
					if ($currentPage > $pageNumber) {
						currentPage.set($pageNumber);
					}
					pageNotifications.set(
						$userNotifications.slice(($currentPage - 1) * $pageSize, $currentPage * $pageSize)
					);
				} else {
					userNotifications.set([]);
					pageNotifications.set([]);
				}
			}}
		>
			Unread
		</button>

		{#if $userNotifications && $userNotifications.filter((e) => !e.seen).length > 0}
			<button
				role="tab"
				class={`tab`}
				on:click={async () => {
					// api call
					await updateBulkNotification(data.notificationBaseUrl, data.token, { seen: true });
					let notificationsResponse = await getUserNotifications(
						data.notificationBaseUrl,
						data.token,
						user.email
					);
					notificationsResponse.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
					// Update page Notifications state
					userNotifications.set(notificationsResponse);
					pageNotifications.set(
						$userNotifications.slice(($currentPage - 1) * $pageSize, $currentPage * $pageSize)
					);
					pageNumber.set(setPageNumber($userNotifications));
					currentPage.set(1);
					notificationsFilter.set('All');
					navbarLatestUserNotifications.set([]);
					navbarNotificationsCount.set(0);
				}}
			>
				Mark All As Read
			</button>
		{/if}
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
									<div class="text-sm opacity-50">{notification.sender}</div>
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
		{#if $userNotifications && $userNotifications.filter((e) => !e.seen).length > 0 || $notificationsFilter !== 'Unread'}
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
			<h1 class="text-center text-2xl font-extrabold">No Unread Notifications were found</h1>
		{/if}
	{:else}
		<div>
			<h1 class="text-center text-2xl font-extrabold">No Notifications were found</h1>
		</div>
	{/if}
</div>
