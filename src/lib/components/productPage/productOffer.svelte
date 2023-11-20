<script lang="ts">
	import axios from 'axios';
	import type { Product } from '../../../models/product';
	import type { User } from '../../../models/user';
	import Cookies from 'js-cookie';
	import { getCurrentUserAvatar } from '../../../service/gateway';
	import { addProductOwnerNotification, addUserNotification } from '../../../service/notification';

	export let data: any;
	export let offer: any;
	export let productTitle: string;
	export let productPrice: number;
	export let pageSource: string;


	const user: User = data.user;
	const product: Product = data.product;
	const productOwner = data.productOwner;

	let offerAmount = offer ? offer.amount : 0;

	const getUserAvatar = async () => {
		if (user) {
			const gatewayBaseUrl = data.gatewayBaseUrl as string;
			return await getCurrentUserAvatar(gatewayBaseUrl);
		}
	};

	const makeOffer = async () => {
		if (!user) {
			return alert('You need to login to make an offer');
		}
		try {
			let offerResponse;
			if (offer) {
				offerResponse = await axios.patch(`/api/offers/${offer.id}`, { amount: offerAmount });
			} else {
				const offerPayload = {
					username: user.email,
					productTitle,
					productOwner: product.username,
					productId: product.id,
					status: 'PENDING',
					amount: offerAmount
				};
				offerResponse = await axios.post('/api/offers', offerPayload);
			}
			if (offerResponse.data && (offerResponse.status === 200 || 201)) {
				// Post User Notification
				const notificationBaseUrl = data.notificationBaseUrl;
				const token = Cookies.get('token') as string;
				const userImage = await getUserAvatar();
				const userNotificationPayload = {
					userEmail: user.email,
					username: user.username,
					userImage,
					userId: user.id,
					title: 'Make Product Offer',
					message: offer
						? `You updated your offer to ${productOwner ? productOwner : offer.productOwnerUsername} for product ${productTitle} with amount from ${offer.amount} to ${offerAmount} TND`
						: `You sent an offer to ${productOwner ? productOwner : offer.productOwnerUsername} for product ${productTitle} with amount of ${offerAmount} TND`,
					seen: false
				};

				await addUserNotification(notificationBaseUrl, token, userNotificationPayload);

				// Post ProductOwner Notification
				const gatewayBaseUrl = data.gatewayBaseUrl as string;
				const appSigninPayload = {
					email: data.appEmail as string,
					password: data.appPassword as string
				};
				const productOwnerNotificationPayload = {
					title: 'Make Product Offer',
					userImage,
					message: offer
						? `${user.username} has changed his offer for product ${productTitle} with amount from ${offer.amount} to ${offerAmount} TND`
						: `You get an offer from ${user.username} for product ${productTitle} with amount of ${offerAmount} TND`
				};

				await addProductOwnerNotification(
					notificationBaseUrl,
					gatewayBaseUrl,
					appSigninPayload,
					product ? product.username : offer.productOwner,
					productOwnerNotificationPayload
				);
				alert(
					`Offer for product ${productTitle} with ${offerAmount} has been created successfully`
				);
			}
		} catch (error: any) {
			console.error('Error:', error);
			alert(error.response.data.message.body.message);
		}
	};
</script>

<button
	class={`btn ${pageSource === 'CartPage' ? 'btn-warning btn-xs' : ''}`}
	on:click={() => {
		const modal = document.getElementById(`my_modal_${offer ? offer.id : 0}`);
		if (modal) {
			modal.showModal();
		}
	}}>{pageSource === 'CartPage' ? 'Update' : offer ? 'Change Offer' : 'Make Offer'}</button
>
<dialog id={`my_modal_${offer ? offer.id : 0}`} class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="font-bold text-lg">{productTitle}</h3>
		<div>
			<p class="py-4">{offer ? 'Update your offer' : 'Set your offer'}</p>
			<input
				type="number"
				placeholder={`${productPrice}`}
				min="0"
				max={productPrice}
				bind:value={offerAmount}
				class="input input-bordered input-primary w-full max-w-xs mb-3"
			/>
		</div>
		<button class="btn btn-sm align-middle" on:click={makeOffer}>Submit</button>
	</div>
</dialog>