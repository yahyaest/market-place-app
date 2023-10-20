<script lang="ts">
	import type { PageData } from './$types';
	import CommentSection from '$lib/components/productPage/commentSection.svelte';
	import SimilarProductsSection from '$lib/components/productPage/similarProductsSection.svelte';
	import ProductInfo from '$lib/components/productPage/productInfo.svelte';

	export let data: PageData;
	const error = data.error;
</script>

<div>
	{#if !error}
		<div>
			<ProductInfo bind:data />
			<CommentSection bind:data />
			<SimilarProductsSection bind:data />
		</div>
	{:else}
		<div class="flex h-screen">
			<div class="m-auto">
				<h1 class="text-3xl text-center font-bold font-mono">{error}</h1>
			</div>
		</div>
	{/if}
</div>
