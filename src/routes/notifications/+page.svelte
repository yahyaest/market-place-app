<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { User } from '../../models/user';
	import type { Notification } from '../../models/notification';
	import type { PageData } from './$types';

	export let data: PageData;
	const user: Writable<User | null> = writable(data.user);
	const userNotifications: Notification[] = data.userNotifications;

	console.log(userNotifications[0]);
</script>

<div class="overflow-x-auto mx-auto w-full md:w-4/5">
	<table class="table">
		<!-- head -->

		<tbody>
			<!-- row 1 -->
			{#each userNotifications as notification, index (notification)}
				<tr>
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
					</td>
					<td>Purple</td>
					<th>
						<button class="btn btn-ghost btn-xs">details</button>
					</th>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
