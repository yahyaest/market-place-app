import axios from 'axios';
import tunisiaStatesData from '../../static/data/tunisiaStates.json';
import tunisiaCitiesData from '../../static/data/tunisiaCities.json';

export const getCountries = async () => {
	try {
		const countriesResponse = await axios.get('https://countriesnow.space/api/v0.1/countries');
		const countries = [];
		for (const country of countriesResponse.data.data) {
			countries.push(country.country);
		}
		return countries;
	} catch (error: any) {
		console.log(error.response.data.msg);
	}
};

export const getCountryStates = async (country: string) => {
	try {
		const statesResponse = await axios.post(
			'https://countriesnow.space/api/v0.1/countries/states',
			{
				country
			}
		);
		const states = [];
		for (const state of statesResponse.data.data.states) {
			states.push(state.name);
		}
		return states;
	} catch (error: any) {
		console.log(error.response.data.msg);
	}
};

export const getStateCities = async (country: string, state: string) => {
	try {
		const citiesResponse = await axios.post(
			'https://countriesnow.space/api/v0.1/countries/state/cities',
			{
				country,
				state
			}
		);
		const cities = [];
		for (const city of citiesResponse.data.data) {
			cities.push(city);
		}
		return cities;
	} catch (error: any) {
		console.log(error.response.data.msg);
	}
};

export const getTunisiaStates = () => {
	const tunisiaStates = [];
	for (const state of tunisiaStatesData) {
		tunisiaStates.push(state.name);
	}
	return tunisiaStates;
};

export const getTunisiaStateCities = (state: string) => {
	const tunisiaStateCities = [];
	const tunisiaStateCitiesData = tunisiaCitiesData.filter((city) => city.governoratexid === state);
	for (const city of tunisiaStateCitiesData) {
		tunisiaStateCities.push(city.name);
	}
	return tunisiaStateCities;
};

// getCountries();
// getCountryStates('United States');
// getStateCities('United States', 'Florida');
// getTunisiaStates();
// getTunisiaStateCities('Nabeul')
