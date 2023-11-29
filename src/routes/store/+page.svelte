<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const userStoreProducts = data.userStoreProducts;
</script>

<div class="overflow-x-auto mx-auto w-4/5 sm:w-5/6">
	<h1 class="text-center">Store</h1>
	{#if userStoreProducts && userStoreProducts.length > 0}
		<div class="flex flex-wrap justify-evenly">
			{#each userStoreProducts as product}
				<div
					class="card card-side w-[32rem] h-[15rem] mx-2 my-7 bg-red-500 shadow shadow-red-600 hover:shadow-lg hover:shadow-red-700 hover:scale-105 transition duration-150 ease-in-out"
				>
					<div class="flex flex-auto">
						<img
							class="w-[15rem] h-[15rem] rounded-l-2xl"
							src={product.image}
							alt={product.title}
						/>
						<div class="card-body">
							<h2
								class={`card-title ${
									product.title.length > 40 ? 'text-xs' : 'text-sm'
								} text-black font-bold`}
							>
								{product.title}
							</h2>
							<p class="text-sm font-semibold my-2">{product.price} TND</p>
							<div class="badge badge-accent text-xs my-1">
								{product.category}/{product.subCategory}
							</div>
							<div class="badge badge-secondary my-1">
								{`${product.offers.length} ${product.offers.length > 1 ? 'Offers' : 'Offer'}`}
							</div>
							<div class="card-actions justify-end">
								<button class="btn btn-primary btn-sm cursor-pointer">Manage</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
