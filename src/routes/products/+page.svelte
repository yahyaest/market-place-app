<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const products = data.products;
	const error = data.error;
</script>

<div>
	{#if !error}
		<div class="flex-none mx-auto w-4/5 sm:w-3/4" >
            {#if products}
            {#each products as product}
            <h1>{product.title}</h1>
            <img src={product.images ? product.images[0].url : ""} alt="">
            {/each}
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
