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
				<div class="card card-side bg-red-500 shadow-xl cursor-pointer mx-2 my-5 hover:-translate-y-6 transition duration-150 ease-in-out" style="width: 32rem; height:15rem;" >
                    <div class="flex flex-auto">
						<figure>
							<img
                                style="width: 15rem ; height:15rem"
								src={product.image}
								alt={product.title}
							/>
						</figure>
						<div class="card-body">
							<h2 class="card-title text-xs font-bold">{product.title}</h2>
							<p>{product.price} TND</p>
                            <div class="badge badge-secondary">6 Offers</div>
							<div class="card-actions justify-end">
                                <button class="btn btn-primary btn-sm">Manage</button>
							</div>
						</div>

                    </div>
					</div>
			{/each}
		</div>
	{/if}
</div>
