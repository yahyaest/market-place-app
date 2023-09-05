<script lang="ts">
	import { getCategories, getSubCategories } from '../../../service/categories';

 export let category =  ''
 export let subCategory =  ''
	let categories: string[] = [];
	let subCategories: string[] = [];

	const setCategories = () => {
		categories = getCategories();
	};
	setCategories();

	const setSubCategories = () => {
		subCategories = getSubCategories(category);
	};

	function handleCategoryChange(event: any) {
		category = event.target.value;
		setSubCategories();
		subCategory = '';
	}

	function handleSubCategoryChange(event: any) {
		subCategory = event.target.value;
	}
</script>

<div class="space-y-12 max-w-screen-md w-full">
	<div>
		<label for="category" class="block text-sm font-medium text-gray-700"> Category </label>
		<select
			class="select select-primary w-full max-w-xs"
			on:change={handleCategoryChange}
			bind:value={category}
		>
			<option disabled selected>Select A Category</option>
			{#each categories as category}
				<option value={category}>{category}</option>
			{/each}
		</select>
	</div>

	<div>
		<label for="subCategory" class="block text-sm font-medium text-gray-700"> SubCategory </label>
		<select
			class="select select-primary w-full max-w-xs"
			on:change={handleSubCategoryChange}
			bind:value={subCategory}
			disabled={category.length === 0 ? true : false}
		>
			<option disabled selected>Select A SubCategory</option>
			{#each subCategories as subCategory}
				<option value={subCategory}>{subCategory}</option>
			{/each}
		</select>
	</div>
</div>
