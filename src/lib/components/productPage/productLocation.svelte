<script lang="ts">
	import {
		getCountries,
		getCountryStates,
		getStateCities,
		getTunisiaStateCities,
		getTunisiaStates
	} from '../../../service/countries';

	export let country = '';
	export let state = '';
	export let city = '';
	let countries: any[] | undefined = [];
	let states: any[] | undefined = [];
	let cities: any[] | undefined = [];
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
</script>

<div class="space-y-12 max-w-screen-md w-full">
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
</div>
