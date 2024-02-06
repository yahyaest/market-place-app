<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Product } from '../../../models/product';
	import type { PageData } from './$types';
	import { writable, type Writable } from 'svelte/store';

	export let data: PageData;
	const error = data.error;

	const setPageNumber = (data: Product[]) => {
		return data
			? (data.length / $pageSize) % 1 === 0
				? Math.floor(data.length / $pageSize)
				: Math.floor(data.length / $pageSize) + 1
			: 1;
	};

	const productsSearchResult = data.productsSearchResult;
	const pageSize: Writable<number> = writable(10);
	const pageNumber: Writable<number> = writable(
		setPageNumber(productsSearchResult ? productsSearchResult : [])
	);
	const currentPage: Writable<number> = writable(1);
	const pageProducts: Writable<Product[]> = writable(
		productsSearchResult ? productsSearchResult.slice(0, $pageSize) : []
	);
</script>

<div class="overflow-x-auto mx-auto w-full md:w-4/5">
	{#if productsSearchResult}
		<h1 class="text-error text-center text-2xl font-bold my-5">
			{productsSearchResult.length} Search {`${
				productsSearchResult.length > 1 ? 'results' : 'result'
			}`} for "{data.searchQuery}"
		</h1>
		{#if productsSearchResult.length > 1}
			<table class="table">
				<thead>
					<tr>
						<th>Product</th>
						<th>Owner</th>
						<th>Price</th>
						<th>Is Sold</th>
					</tr>
				</thead>
				<tbody>
					{#each $pageProducts as product, index (product)}
						<tr
							class={`hover:bg-slate-300 transition duration-150 ease-in-out cursor-pointer`}
							on:click={() => goto(`/products/${product.slug}`)}
						>
							<td>
								<div class="flex items-center gap-3">
									<div class="avatar">
										<div class="mask mask-squircle w-12 h-12">
											<img src={`${product.imageUrl}`} alt={product.username} />
										</div>
									</div>
									<div>
										<div class="font-bold w-full">{product.title}</div>
										<div class="badge badge-ghost badge-sm mx-1">
											{product.category}/{product.subCategory}
										</div>
									</div>
								</div>
							</td>
							<td>
								<div class="flex items-center gap-3">
									<div class="avatar">
										<div class="mask mask-squircle w-12 h-12">
											<img
												src={`${data.gatewayBaseUrl}/${product.ownerImage}`}
												alt={`${product.username}`}
											/>
										</div>
									</div>
									<div>
										<div class="font-bold">{product.ownerName}</div>
										<div class="badge badge-ghost badge-sm">{product.username}</div>
									</div>
								</div>
							</td>
							<td>
								{product.price} TND
							</td>
							<td>
								<span class="badge badge-md badge-primary text-xs">
									{product.sold ? 'Sold' : 'Available'}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}

		{#if $pageNumber > 1}
			<div class="join my-10 flex justify-center">
				{#each Array.from({ length: $pageNumber }, (_, i) => i + 1) as pageIndex}
					<button
						class={`join-item btn ${
							$currentPage === pageIndex
								? 'btn-primary'
								: 'hover:bg-slate-300 transition duration-150 ease-in-out'
						}`}
						on:click={() => {
							currentPage.set(pageIndex);
							pageProducts.set(
								productsSearchResult.slice((pageIndex - 1) * $pageSize, pageIndex * $pageSize)
							);
						}}>{pageIndex}</button
					>
				{/each}
			</div>
		{/if}
	{:else}
		<div>
			<h1 class="text-center text-2xl font-extrabold">No Product was found</h1>
		</div>
	{/if}
</div>
