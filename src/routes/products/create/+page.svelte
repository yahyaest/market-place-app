<script lang="ts">
	import AddProduct from '$lib/components/addProduct.svelte';
	import type { PageData } from "./$types";

	export let data: PageData;

let baseUrl = data.commentBaseUrl

</script>

<div>
	<h1 class="text-3xl	text-center font-bold font-mono mb-5">Add new Product</h1>

	<AddProduct bind:baseUrl />
</div>
