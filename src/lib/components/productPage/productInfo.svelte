<script lang="ts">
	import type { Product } from '../../../models/product';
	import type { User } from '../../../models/user';
	import ProductOffer from './productOffer.svelte';

	export let data: any;

	const user: User = data.user;
	const product: Product = data.product;
	const productImages = data.productImages;
	const productTags = data.productTags;

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

		{#if user &&  product.username !== user.email}
			<ProductOffer
				bind:data
				productTitle={product.title}
				productPrice={product.price}
				offer={data.offer}
				pageSource={"ProductPage"}
			/>
		{/if}
	</div>
</div>

<style>
	.description {
		white-space: pre-line;
	}
</style>
