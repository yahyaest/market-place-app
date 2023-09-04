<script lang="ts">
	import axios from 'axios';
	import {
		getCountries,
		getCountryStates,
		getStateCities,
		getTunisiaStateCities,
		getTunisiaStates
	} from '../../service/countries';

	import UploadProductImages from '$lib/components/uploadProductImages.svelte';

	let title = '';
	let username = '';
	let price = '';
	let category = '';
	let description = '';
	let phoneNumber = '';
	let areacode = '';
	let country = '';
	let state = '';
	let city = '';
	let countries: any[] | undefined = [];
	let states: any[] | undefined = [];
	let cities: any[] | undefined = [];
	let file: any = null;
	let files: any[] = [];

	const setCountries = async () => {
		countries = await getCountries();
	};
	setCountries();

	const setStates = async () => {
		if (country === 'Tunisia') {
			states = getTunisiaStates();
		} else {
			states = await getCountryStates(country);
		}
	};

	const setCities = async () => {
		if (country === 'Tunisia') {
			cities = getTunisiaStateCities(state);
		} else {
			cities = await getStateCities(country, state);
		}
	};

	function handleCountryChange(event: any) {
		country = event.target.value;
		setStates();
		state = '';
		city = '';
	}

	function handleStateChange(event: any) {
		state = event.target.value;
		setCities();
		city = '';
	}

	function handleCityChange(event: any) {
		city = event.target.value;
	}

	const uploadImage = async (product : any) => {
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
			subCategory: category,
			description,
			phone: `+${areacode} ${phoneNumber}`,
			country,
			state,
			city,
			tags: 'tags'
		};

		try {
			const response = await axios.post('/api/products', productData);
			const createdProduct = response.data
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

		<div>
			<label for="category" class="block text-sm font-medium text-gray-700"> Category </label>
			<input
				type="text"
				id="category"
				name="category"
				class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				bind:value={category}
			/>
		</div>

		<div>
			<label for="description" class="block text-sm font-medium text-gray-700"> Description </label>
			<textarea
				id="description"
				name="description"
				class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				bind:value={description}
			/>
		</div>
		<!-- 
		<div>
			<label for="phone" class="block text-sm font-medium text-gray-700"> Phone </label>
			<input
				type="text"
				id="phone"
				name="phone"
				class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				bind:value={phone}
			/>
		</div> -->

		<div>
			<label for="country" class="block text-sm font-medium text-gray-700"> Country </label>
			<select
				class="select select-primary w-full max-w-xs"
				on:change={handleCountryChange}
				bind:value={country}
			>
				<option disabled selected>Select A Country</option>
				{#each countries as country}
					<option value={country}>{country}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="state" class="block text-sm font-medium text-gray-700"> State </label>
			<select
				class="select select-primary w-full max-w-xs"
				on:change={handleStateChange}
				bind:value={state}
				disabled={country.length === 0 ? true : false}
			>
				<option disabled selected>Select A State</option>
				{#each states as state}
					<option value={state}>{state}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="city" class="block text-sm font-medium text-gray-700"> City </label>
			<select
				class="select select-primary w-full max-w-xs"
				on:change={handleCityChange}
				bind:value={city}
				disabled={state.length === 0 ? true : false}
			>
				<option disabled selected>Select A City</option>
				{#each cities as city}
					<option value={city}>{city}</option>
				{/each}
			</select>
		</div>

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
