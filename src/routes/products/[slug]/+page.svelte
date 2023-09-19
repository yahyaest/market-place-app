<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const product = data.product;
	const productImages = data.productImages;
	const productTags = data.productTags;
	const error = data.error;
</script>

<div>
	{#if !error}
		<div class="flex mx-auto w-4/5 sm:w-2/3">
			<div class="carousel flex-auto w-2/3 my-5">
				{#if productImages}
					{#each productImages as image, index (image)}
						<div id={`${index}`} class="carousel-item relative w-full">
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

			<div class="flex-auto">
				<h1 class="text-3xl text-center font-bold font-mono my-5">{product?.title}</h1>

				<h4 class="text-xl font-bold font-mono my-2">Description:</h4>
				<p class="description">{product?.description}</p>
			</div>
		</div>
	{:else}
		<div class="flex h-screen">
			<div class="m-auto">
				<h1 class="text-3xl text-center font-bold font-mono">{error}</h1>
			</div>
		</div>
	{/if}
</div>

<style>
	.description {
		white-space: pre-line;
	}
</style>
