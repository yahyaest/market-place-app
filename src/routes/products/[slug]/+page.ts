import axios from 'axios';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const { slug } = params;

	try {
		const response = await axios.get(`/api/products/?slug=${slug}`);
		const product = response.data.product;

		return {product};
	} catch (error) {
		console.error('Error:', error);
		return {error};
	}
}) satisfies PageLoad;
