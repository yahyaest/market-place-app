<script lang="ts">
	import ProductOffer from '$lib/components/productPage/productOffer.svelte';
	import axios from 'axios';
	import type { PageData } from './$types';
	import { writable, type Writable } from 'svelte/store';
	import { addProductOwnerNotification, addUserNotification } from '../../service/notification';
	import Cookies from 'js-cookie';

	export let data: PageData;
	const gatewayBaseUrl = data.gatewayBaseUrl as string;
	const notificationBaseUrl = data.notificationBaseUrl as string;
	const user = data.user;
	const userImage = data.userImage;
	const userOffers: Writable<any[] | null> = writable(data.userOffers);
	let showToast: boolean = false;
	let toastMessage: string = '';

	const handleNotification = (offer:any) => {
		showToast = true;
		toastMessage = `Offer for product ${offer.productTitle} was removed successfully`;
		setTimeout(() => {
			showToast = false;
		}, 5000);
	};

	const deleteOffer = async (offerId: number) => {
		try {
			await axios.delete(`/api/offers/${offerId}`);
			const offers = [...($userOffers as any[])];
			userOffers.set(offers.filter((offer) => offer.id !== offerId));
		} catch (error) {
			console.error(error);
		}
	};

	const createUserNotification = async (offer: any) => {
		try {
			const token = Cookies.get('token') as string;
			const userNotificationPayload = {
				userEmail: user.email,
				username: user.username,
				userImage,
				userId: user.id,
				title: 'Delete Product Offer',
				message: `You Deleted your offer to ${offer.productOwnerUsername} for product ${offer.productTitle}`,
				seen: false
			};

			await addUserNotification(notificationBaseUrl, token, userNotificationPayload);
		} catch (error) {
			console.error(error);
		}
	};

	const createProductOwnerNotification = async (offer: any) => {
		try {
			const appSigninPayload = {
				email: data.appEmail as string,
				password: data.appPassword as string
			};
			const productOwnerNotificationPayload = {
				title: 'Delete Product Offer',
				userImage,
				message: `${user.username} has deleted his offer for product ${offer.productTitle}`
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
</script>

<div class="overflow-x-auto mx-auto w-4/5 sm:w-5/6">
	<h1 class="text-center text-2xl font-bold mb-5">Your offers</h1>
	{#if $userOffers}
		<table class="table">
			<thead>
				<tr>
					<th />
					<th>Product</th>
					<th>Owner</th>
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
										<img src={`${offer.image}`} alt={`${offer.productTitle}`} />
									</div>
								</div>
								<div>
									<div class="font-bold">{offer.productTitle}</div>
									<div class="badge badge-ghost badge-sm mx-1">{offer.productCategory}</div>
									<div class="badge badge-ghost badge-sm mx-1">{offer.productPrice} TND</div>
								</div>
							</div>
						</td>

						<td>
							<div class="flex items-center gap-3">
								<div class="avatar">
									<div class="mask mask-squircle w-12 h-12">
										<img
											src={`${gatewayBaseUrl}/${offer.productOwnerImage}`}
											alt={`${offer.productOwnerUsername}`}
										/>
									</div>
								</div>
								<div>
									<div class="font-bold">{offer.productOwnerUsername}</div>
									<div class="badge badge-ghost badge-sm">{offer.productOwner}</div>
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
							<div>
								<ProductOffer
									bind:data
									productTitle={offer.productTitle}
									productPrice={offer.productPrice}
									{offer}
									pageSource={'CartPage'}
								/>
							</div>
						</th>
						<th>
							<button
								class="btn btn-error btn-xs"
								on:click={async () => {
									await deleteOffer(offer.id);
									await createUserNotification(offer);
									await createProductOwnerNotification(offer);
                                    handleNotification(offer)
								}}>Delete</button
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
