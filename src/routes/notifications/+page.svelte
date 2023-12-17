<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { User } from '../../models/user';
	import type { Notification } from '../../models/notification';
	import type { PageData } from './$types';
	import { formatRelativeTime } from '$lib/utils';
	import { updateNotification } from '../../service/notification';
	import {
		navbarAllUserNotifications,
		navbarLatestUserNotifications,
		navbarNotificationsCount
	} from '../../store';

	export let data: PageData;
	const user: Writable<User | null> = writable(data.user);
	const userNotifications: Notification[] = data.userNotifications;

	const pageSize: Writable<number> = writable(5);
	const pageNumber = Math.floor(userNotifications.length / $pageSize) + 1;
	const currentPage: Writable<number> = writable(1);
	const pageNotifications: Writable<Notification[]> = writable(
		userNotifications.slice(0, $pageSize)
	);

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

	console.log(userNotifications[0], $pageNotifications.length);
</script>

<div class="overflow-x-auto mx-auto w-full md:w-4/5">
	<table class="table">
		<!-- head -->

		<tbody>
			<!-- row 1 -->
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
								class="btn btn-secondary btn-xs"
								on:click={() => handleNotificationUpdate(notification.id)}>Mark As Read</button
							>
						</td>
					{:else}
						<td />
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="join my-10 flex justify-center">
		{#each Array.from({ length: pageNumber }, (_, i) => i + 1) as pageIndex}
			<button
				class={`join-item btn ${
					$currentPage === pageIndex
						? 'btn-primary'
						: 'hover:bg-slate-300 transition duration-150 ease-in-out'
				}`}
				on:click={() => {
					currentPage.set(pageIndex);
					pageNotifications.set(
						userNotifications.slice((pageIndex - 1) * $pageSize, pageIndex * $pageSize)
					);
				}}>{pageIndex}</button
			>
		{/each}
	</div>
</div>
