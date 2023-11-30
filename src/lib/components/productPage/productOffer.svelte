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

	const gatewayBaseUrl = data.gatewayBaseUrl as string;
	const notificationBaseUrl = data.notificationBaseUrl;
	const user: User = data.user;
	const product: Product = data.product;
	const productOwner = data.productOwner;
	let showToast: boolean = false;
	let toastMessage: string = '';
	let offerAction: string = '';

	let offerAmount = offer ? offer.amount : 0;

	const closeDialog = () => {
		const modal = document.getElementById(`my_modal_${offer ? offer.id : 0}`);
		if (modal) {
			modal.close();
		}
	};

	const getUserAvatar = async () => {
		if (user) {
			const gatewayBaseUrl = data.gatewayBaseUrl as string;
			return await getCurrentUserAvatar(gatewayBaseUrl);
		}
	};

	const handleToast = () => {
		showToast = true;
		toastMessage =
			offerAction === 'CREATE'
				? `Offer for product ${productTitle} with amount ${offerAmount} TND has been created successfully`
				: `Offer for product ${productTitle} was updated with amount ${offerAmount} TND successfully`;

		setTimeout(() => {
			showToast = false;
		}, 5000);
	};

	const postOrUpdateOffer = async () => {
		try {
			if (offer) {
				await axios.patch(`/api/offers/${offer.id}`, { amount: offerAmount, status: 'PENDING' });
				offerAction = 'UPDATE';
			} else {
				const offerPayload = {
					username: user.email,
					productTitle,
					productOwner: product.username,
					productId: product.id,
					status: 'PENDING',
					amount: offerAmount
				};
				await axios.post('/api/offers', offerPayload);
				offerAction = 'CREATE';
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const createUserNotification = async (offer: any) => {
		try {
			const userImage = await getUserAvatar();
			const token = Cookies.get('token') as string;
			const userNotificationPayload = {
				userEmail: user.email,
				username: user.username,
				userImage,
				userId: user.id,
				title: offer ? 'Update Product Offer' : 'Make Product Offer',
				message: offer
					? `You updated your offer to ${
							productOwner ? productOwner : offer.productOwnerUsername
					  } for product ${productTitle} with amount from ${offer.amount} to ${offerAmount} TND`
					: `You sent an offer to ${
							productOwner ? productOwner : offer.productOwnerUsername
					  } for product ${productTitle} with amount of ${offerAmount} TND`,
				seen: false
			};

			await addUserNotification(notificationBaseUrl, token, userNotificationPayload);
		} catch (error) {
			console.error(error);
		}
	};

	const createProductOwnerNotification = async (offer: any) => {
		try {
			const userImage = await getUserAvatar();
			const appSigninPayload = {
				email: data.appEmail as string,
				password: data.appPassword as string
			};
			const productOwnerNotificationPayload = {
				title: offer ? 'Update Product Offer' : 'Make Product Offer',
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
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmit = async () => {
		if (!user) {
			return alert('You need to login to make an offer');
		}
		try {
			await postOrUpdateOffer();
			await createUserNotification(offer);
			await createProductOwnerNotification(offer);
			closeDialog();
			handleToast();
			if (pageSource === 'CartPage') {
				setTimeout(function () {
					window.location.reload();
				}, 3000);
			}
		} catch (error: any) {
			console.error('Error:', error);
			alert(error.response.data.message.body.message);
		}
	};
</script>

{#if pageSource === 'CartPage' || !product.sold}
	<button
		class={`btn ${pageSource === 'CartPage' ? 'btn-warning btn-xs' : 'btn-secondary'}`}
		disabled={(offer ? (offer.status === 'ACCEPTED' ? true : false) : false) || offer.productIsSold}
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
			<button class="btn btn-sm align-middle" on:click={handleSubmit}>Submit</button>
		</div>
	</dialog>
{/if}

{#if product && product.sold}
	<div class="alert alert-warning">
		<span class="text-center font-bold">Product Already sold</span>
	</div>
{/if}

{#if showToast}
	<div class="toast toast-top toast-end mt-16">
		<div class="alert alert-success">
			<span>{toastMessage}</span>
		</div>
	</div>
{/if}
