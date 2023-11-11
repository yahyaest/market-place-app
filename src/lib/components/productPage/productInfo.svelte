<script lang="ts">
	import axios from 'axios';
	import type { Product } from '../../../models/product';
	import type { User } from '../../../models/user';
	import { getCurrentUserAvatar } from '../../../service/gateway';
	import { addProductOwnerNotification, addUserNotification } from '../../../service/notification';
	import Cookies from 'js-cookie';

	export let data: any;
	const user: User = data.user;
	const product: Product = data.product;
	const productImages = data.productImages;
	const productTags = data.productTags;
	let offerAmount = 0;

	const tagSeverity = [
		'badge-info',
		'badge-success',
		'badge-warning',
		'badge-error',
		'badge-primary',
		'badge-secondary',
		'badge-accent',
		'badge-ghost'
	];

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
			const offerPayload = {
				username: user.email,
				productTitle: product.title,
				productOwner: product.username,
				productId: product.id,
				status: 'PENDING',
				amount: offerAmount
			};
			const offer = await axios.post('/api/offers', offerPayload);
			console.log(offer.status)
			if (offer.data && offer.status === 201) {
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
					message: `You sent an offer to ${product.username} for product ${product.title} with amount of ${offerAmount} TND`,
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
					message: `You get an offer from ${user.username} for product ${product.title} with amount of ${offerAmount} TND`
				};

				await addProductOwnerNotification(
					notificationBaseUrl,
					gatewayBaseUrl,
					appSigninPayload,
					product.username,
					productOwnerNotificationPayload
				);
				alert(
					`Offer for product ${product.title} with ${offerAmount} has been created successfully`
				);
			}
		} catch (error : any) {
			console.error('Error:', error);
			alert(error.response.data.message.body.message)
		}
	};
</script>

<div class="flex-none mx-auto w-4/5 sm:w-3/4 lg:flex">
	<h1 class="text-3xl text-center font-bold font-mono my-5 lg:hidden">{product?.title}</h1>

	<div class="carousel flex-1 m-5 my-11">
		{#if productImages}
			{#each productImages as image, index (image)}
				<div id={`${index}`} class="carousel-item relative w-full max-h-96 xl:max-h-full">
					<img src={image.url} alt="" class="w-full" />
					<div
						class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
					>
						<a
							href={`#${index === 0 ? productImages.length - 1 : index - 1}`}
							class="btn btn-circle">❮</a
						>
						<a
							href={`#${index === productImages.length - 1 ? 0 : index + 1}`}
							class="btn btn-circle">❯</a
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<div class="flex-1 mx-5">
		<h1 class="text-3xl text-center font-bold font-mono my-5 hidden lg:block">
			{product?.title}
		</h1>
		<h1 class="text-3xl font-bold text-red-600 font-mono my-5">{product?.price} TND</h1>

		<h4 class="text-xl font-bold font-mono my-5">
			Category: {product?.category} / {product?.subCategory}
		</h4>

		<h4 class="text-xl font-bold font-mono my-2">Description:</h4>
		<p class="description">{product?.description}</p>

		<h4 class="text-xl font-bold font-mono mt-5 mb-2">Buyer Info:</h4>
		<p><strong>Name : </strong>{product?.username}</p>
		<p><strong>Phone : </strong>{product?.phone}</p>
		<p><strong>Country : </strong>{product?.country}</p>
		<p><strong>State : </strong>{product?.state}</p>
		{#if product?.city}
			<p><strong>City : </strong>{product?.city}</p>
		{/if}

		<div class="flex flex-wrap my-5">
			<h4 class="text-xl font-bold font-mono my-2">Tags:</h4>
			{#if productTags}
				{#each productTags as tag, index (tag)}
					<div class={`badge badge-lg ${tagSeverity[index % tagSeverity.length]} gap-2 m-2`}>
						{tag.name}
					</div>
				{/each}
			{/if}
		</div>

		{#if product.username !== user.email}
			<button class="btn" onclick="my_modal_3.showModal()">Make Offer</button>
			<dialog id="my_modal_3" class="modal">
				<div class="modal-box">
					<form method="dialog">
						<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
					</form>
					<h3 class="font-bold text-lg">{product.title}</h3>
					<div>
						<p class="py-4">Set your offer</p>
						<input
							type="number"
							placeholder={product.price}
							min="0"
							max={product.price}
							bind:value={offerAmount}
							class="input input-bordered input-primary w-full max-w-xs mb-3"
						/>
					</div>
					<button class="btn btn-sm align-middle" on:click={makeOffer}>Submit</button>
				</div>
			</dialog>
		{/if}
	</div>
</div>

<style>
	.description {
		white-space: pre-line;
	}
</style>
