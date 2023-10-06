<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
	const products = data.products;
	const error = data.error;
	const colorsBgCombinations = data.colorsBgCombinations;

	const formatRelativeTime = (dateString: string | Date) => {
		const inputDate = new Date(dateString);
		const currentDate = new Date();

		const timeDifference = currentDate - inputDate;
		const secondsDifference = Math.floor(timeDifference / 1000);
		const minutesDifference = Math.floor(secondsDifference / 60);
		const hoursDifference = Math.floor(minutesDifference / 60);
		const daysDifference = Math.floor(hoursDifference / 24);
		const monthsDifference = Math.floor(daysDifference / 30.44);
		const yearsDifference = Math.floor(monthsDifference / 12);

		if (yearsDifference > 0) {
			return `${yearsDifference} year${yearsDifference !== 1 ? 's' : ''} ago`;
		} else if (monthsDifference > 0) {
			return `${monthsDifference} month${monthsDifference !== 1 ? 's' : ''} ago`;
		} else if (daysDifference > 0) {
			return `${daysDifference} day${daysDifference !== 1 ? 's' : ''} ago`;
		} else if (hoursDifference > 0) {
			return `${hoursDifference} hour${hoursDifference !== 1 ? 's' : ''} ago`;
		} else if (minutesDifference > 0) {
			return `${minutesDifference} minute${minutesDifference !== 1 ? 's' : ''} ago`;
		} else {
			return `${secondsDifference} second${secondsDifference !== 1 ? 's' : ''} ago`;
		}
	};

	const goToProductPage = async (productSlug: string) => {
		goto(`/products/${productSlug}`);
	};
</script>

<div>
	{#if !error && colorsBgCombinations}
		<div class="flex-none mx-auto w-4/5 sm:w-5/6">
			{#if products}
				<div class="flex flex-wrap justify-evenly">
					{#each products as product, index (product)}
						<div
							class={`card w-96 glass mb-20  cursor-pointer ${
								!colorsBgCombinations[index].value
									? colorsBgCombinations[index].value
									: 'bg-teal-700'
							} shadow shadow-teal-700 hover:shadow-xl hover:shadow-teal-900 hover:-translate-y-6 transition duration-150 ease-in-out`}
							role="button"
							on:click={() => goToProductPage(product.slug)}
							on:keydown={(event) => {
								if (event.key === 'Enter') {
									goToProductPage(product.slug);
								}
							}}
							tabindex="0"
						>
							<figure><img src={product.images ? product.images[0].url : ''} alt="" /></figure>
							<div class="card-body">
								<div class="text-center text-gray-700 font-extrabold text-lg">
									{product.title}
									<div class="badge text-white bg-yellow-400 border-0 mx-5">
										{product.price} TND
									</div>
								</div>
								<div class="mt-1 mb-1 h-[1px] bg-black/25" />
								<p>{product.category} / {product.subCategory}</p>
								<p>
									{product.country}
									{'-->'}
									{product.state}
									{'-->'}
									{product.city}, {formatRelativeTime(product.createdAt)}
								</p>
								<div class="card-actions justify-end" />
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<div class="flex h-screen">
			<div class="m-auto">
				<h1 class="text-3xl text-center font-bold font-mono">{error}</h1>
			</div>
		</div>
	{/if}
</div>
