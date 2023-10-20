<script lang="ts">
	export let data: any;
	const similarProducts = data.similarProducts;

	const goToProductPage = async (productSlug: string) => {
		window.location.replace(`/products/${productSlug}`);
	};

	let translation = 0; // Initial X-axis translation
	const maxTranslationWidth = (similarProducts.length - 1) * 256; // 265 px = w-64

	const scrollRight = () => {
		if (translation > -maxTranslationWidth) {
			translation -= 256;
		}
	};

	const scrollLeft = () => {
		if (translation < 0) {
			translation += 256;
		}
	};
</script>

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
