<script lang="ts">
	import axios from 'axios';
	import type { PageData } from './$types';
	import { writable, type Writable } from 'svelte/store';
	import { addProductOwnerNotification, addUserNotification } from '../../../service/notification';
	import Cookies from 'js-cookie';

	export let data: PageData;
	const gatewayBaseUrl = data.gatewayBaseUrl as string;
	const notificationBaseUrl = data.notificationBaseUrl as string;
	const user = data.user;
	const userImage = data.userImage;
	const product = data.product;
	const userOffers: Writable<any[] | null> = writable(data.productOffers);
	let showToast: boolean = false;
	let toastMessage: string = '';

	const createUserNotification = async (
		offer: any,
		notification: { title: string; message: string }
	) => {
		try {
			const token = Cookies.get('token') as string;
			const userNotificationPayload = {
				userEmail: offer.email,
				username: offer.username,
				userImage: offer.userImage,
				userId: offer.userId,
				title: notification.title,
				message: notification.message,
				seen: false
			};

			await addUserNotification(notificationBaseUrl, token, userNotificationPayload);
		} catch (error) {
			console.error(error);
		}
	};

	const createProductOwnerNotification = async (
		offer: any,
		notification: {
			title: string;
			message: string;
		}
	) => {
		try {
			const appSigninPayload = {
				email: data.appEmail as string,
				password: data.appPassword as string
			};
			const productOwnerNotificationPayload = {
				title: notification.title,
				userImage,
				message: notification.message
			};

			await addProductOwnerNotification(
				notificationBaseUrl,
				gatewayBaseUrl,
				appSigninPayload,
				offer.productOwner,
				productOwnerNotificationPayload
			);
		} catch (error) {
			console.error(error);
		}
	};

	const handleNotification = async (offer: any, action: string, isToast = true) => {
		let notification = {
			title: `${action} Product Offer`,
			message: `Your offer for product ${offer.productTitle} with amount of ${offer.amount} was ${action}ed  `
		};
		await createUserNotification(offer, notification);
		notification.message = `You ${action}ed offer from ${offer.username} for product ${offer.productTitle} with amount of ${offer.amount}`;
		await createProductOwnerNotification(offer, notification);
		if (isToast) {
			showToast = true;
			toastMessage = `Offer for product ${offer.productTitle} was ${action}ed successfully`;
			setTimeout(() => {
				showToast = false;
			}, 5000);
		}
	};

	const updateOfferStatus = async (offerId: number, status: string) => {
		try {
			const offers = [...($userOffers as any[])];
			let updatedOffer = await axios.patch(`/api/offers/${offerId}`, { status });
			offers.map((offer) => {
				if (offer.id === offerId) {
					offer.status = updatedOffer.data.offer.status;
				}
			});
			if (status === 'ACCEPTED') {
				//Reject the rest offers
				const offersToReject = $userOffers?.filter((offer) => offer.id !== offerId);
				if (offersToReject && offersToReject?.length > 0) {
					for (const offer of offersToReject) {
						if (offer.status === 'PENDING') {
							updatedOffer = await axios.patch(`/api/offers/${offer.id}`, { status: 'REJECTED' });
							// Update UI State
							offers.map((e) => {
								if (e.id === offer.id) {
									e.status = updatedOffer.data.offer.status;
								}
							});
							// Handle notifications
							handleNotification(offer, 'Reject', false);
						}
					}
				}
			}
			userOffers.set(offers);
		} catch (error) {
			console.error(error);
		}
	};
</script>

<div class="overflow-x-auto mx-auto w-4/5 sm:w-5/6">
	<h1 class="text-center text-2xl font-bold mb-5">Product {product?.title} offers</h1>
	{#if $userOffers}
		<table class="table">
			<thead>
				<tr>
					<th />
					<th>User</th>
					<th>Offer</th>
					<th>Status</th>
					<th />
					<th />
				</tr>
			</thead>
			<tbody>
				{#each $userOffers as offer (offer.id)}
					<tr>
						<th>
							<label>
								<input type="checkbox" class="checkbox" />
							</label>
						</th>

						<td>
							<div class="flex items-center gap-3">
								<div class="avatar">
									<div class="mask mask-squircle w-12 h-12">
										<img src={`${gatewayBaseUrl}/${offer.userImage}`} alt={`${offer.username}`} />
									</div>
								</div>
								<div>
									<div class="font-bold">{offer.email}</div>
									<div class="badge badge-ghost badge-sm">{offer.username}</div>
								</div>
							</div>
						</td>
						<td>{offer.amount} TND</td>
						{#if offer.status === 'PENDING'}
							<td>
								<div class="badge badge-sm badge-outline badge-warning">{offer.status}</div>
							</td>
						{:else if offer.status === 'REJECTED'}
							<td>
								<div class="badge badge-sm badge-outline badge-error">{offer.status}</div>
							</td>
						{:else}
							<td>
								<div class="badge badge-sm badge-outline badge-success">{offer.status}</div>
							</td>
						{/if}
						<th>
							<button
								class="btn btn-success btn-xs"
								disabled={offer.status !== 'PENDING' ? true : false}
								on:click={async () => {
									await updateOfferStatus(offer.id, 'ACCEPTED');
									handleNotification(offer, 'Accept');
								}}>Accept</button
							>
						</th>
						<th>
							<button
								class="btn btn-error btn-xs"
								disabled={offer.status !== 'PENDING' ? true : false}
								on:click={async () => {
									await updateOfferStatus(offer.id, 'REJECTED');
									handleNotification(offer, 'Reject');
								}}>Reject</button
							>
						</th>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

{#if showToast}
	<div class="toast toast-top toast-end mt-16">
		<div class="alert alert-success">
			<span>{toastMessage}</span>
		</div>
	</div>
{/if}
