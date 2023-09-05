<script lang="ts">
	import axios from 'axios';
	import UploadProductImages from '$lib/components/productPage/uploadProductImages.svelte';
	import ProductCategory from './productPage/productCategory.svelte';
	import ProductLocation from './productPage/productLocation.svelte';

	let title = '';
	let username = '';
	let price = '';
	let category = '';
	let subCategory = '';
	let description = '';
	let phoneNumber = '';
	let areacode = '';
	let country = '';
	let state = '';
	let city = '';
	let file: any = null;
	let files: any[] = [];

	const uploadImage = async (product: any) => {
		for (const file of files) {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('username', 'username');
			formData.append('productTitle', product.title);
			formData.append('productId', product.id);
			formData.append('name', file.name);
			try {
				const response = await axios.post('/api/images', formData);
			} catch (error) {
				console.error('Error:', error);
			}
		}
	};

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const productData = {
			title,
			username,
			price: parseInt(price), // Convert price to a number
			category,
			subCategory,
			description,
			phone: `+${areacode} ${phoneNumber}`,
			country,
			state,
			city,
			tags: 'tags'
		};

		try {
			const response = await axios.post('/api/products', productData);
			const createdProduct = response.data.product;
			await uploadImage(createdProduct);

			if (response.status === 201) {
				// Product created successfully, you can handle this case
				console.log('Product created successfully');
				// Toast

				// Rdirect
			} else {
				// Handle errors here if needed
				console.error('Failed to create product');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<form on:submit={handleSubmit}>
	<div class="space-y-12 mx-auto w-4/5 sm:w-1/2">
		<div>
			<label for="title" class="block text-sm font-medium text-gray-700"> Title </label>
			<input
				type="text"
				id="title"
				name="title"
				class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				bind:value={title}
			/>
		</div>

		<div>
			<label for="username" class="block text-sm font-medium text-gray-700"> Username </label>
			<input
				type="text"
				id="username"
				name="username"
				class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				bind:value={username}
			/>
		</div>

		<div>
			<label for="price" class="block text-sm font-medium text-gray-700"> Price </label>
			<input
				type="number"
				id="price"
				name="price"
				class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				bind:value={price}
			/>
		</div>

		<ProductCategory bind:category bind:subCategory />
		<div>
			<label for="description" class="block text-sm font-medium text-gray-700"> Description </label>
			<textarea
				id="description"
				name="description"
				class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				bind:value={description}
			/>
		</div>

		<ProductLocation bind:country bind:state bind:city />

		<div class="form-control">
			<label class="label">
				<span class="label-text">Phone</span>
			</label>
			<label class="input-group">
				<span>+</span>
				<input
					type="number"
					placeholder="216"
					min="0"
					max="999"
					class="input input-bordered w-20"
					bind:value={areacode}
				/>
				<input
					type="number"
					placeholder="55 555 555"
					min="0"
					max="99999999"
					class="input input-bordered"
					bind:value={phoneNumber}
				/>
			</label>
		</div>

		<UploadProductImages bind:file bind:files />
		<div>
			<button type="submit" class="btn btn-primary p-2"> Add Product </button>
		</div>
	</div>
</form>
