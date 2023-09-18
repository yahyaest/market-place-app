<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const product = data.product;
    const productImages = data.productImages
    const productTags = data.productTags

</script>

<div class="mx-auto w-4/5 sm:w-1/2">
	<h1 class="text-3xl text-center font-bold font-mono my-5">{product.title}</h1>
    <!-- {#each productImage as image}
    {/each} -->
</div>
