<script lang="ts">
	import type { PageData } from './$types';
	import CommentSection from '$lib/components/productPage/commentSection.svelte';
	export let data: PageData;

	const product = data.product;
	const similarProducts = data.similarProducts;
	const productImages = data.productImages;
	const productTags = data.productTags;
	const error = data.error;

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

	const goToProductPage = async (productSlug: string) => {
		window.location.replace(`/products/${productSlug}`);
	};

	let translation = 0; // Initial X-axis translation
	const maxTranslationWidth = (similarProducts.length - 1) * 256; // 265 px = w-64

	const scrollRight = () => {
		if (translation > -maxTranslationWidth) {
			translation -= 256;
		}
		console.log('right', translation);
	};

	const scrollLeft = () => {
		if (translation < 0) {
			translation += 256;
		}
		console.log('left', translation);
	};
</script>

<div>
	{#if !error}
		<div>
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
				</div>
			</div>
			<!-- Comment Section -->
			<CommentSection bind:data />
			<!-- Similar Product Section -->
			<div class="mx-auto px-4 w-4/5 sm:w-3/4">
				<h1 class="text-lg lg:text-2xl font-bold">See Also ({similarProducts.length})</h1>
				<div class="flex flex-row">
					<div class="carousel rounded-box">
						{#each similarProducts as product}
							<div
								class="carousel-item flex flex-col cursor-pointer mx-3"
								style="	transform: translateX({translation}px);
								transition: transform 0.3s;"
								role="button"
								on:click={() => goToProductPage(product.slug)}
								on:keydown={(event) => {
									if (event.key === 'Enter') {
										goToProductPage(product.slug);
									}
								}}
								tabindex="0"
							>
								<img class="w-64 h-64" src={`${product.images[0].url}`} alt={product.title} />
								<h1 class="text-sm font-bold text-red-600 font-mono my-2">{product?.price} TND</h1>
								<h1 class="text-xs font-bold font-mono w-48 my-2">{product?.title}</h1>
							</div>
						{/each}
					</div>
					<div class="flex flex-col justify-center mx-2 space-y-2">
						<button class="btn btn-circle btn-primary" on:click={scrollRight}>❯</button>
						<button class="btn btn-circle btn-secondary" on:click={scrollLeft}>❮</button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex h-screen">
			<div class="m-auto">
				<h1 class="text-3xl text-center font-bold font-mono">{error}</h1>
			</div>
		</div>
	{/if}
	<!-- find also -->
</div>

<style>
	.description {
		white-space: pre-line;
	}
</style>
