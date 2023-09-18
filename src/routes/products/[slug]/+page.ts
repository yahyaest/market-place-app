import axios from 'axios';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const { slug } = params;

	try {
        // Get product
		const productResponse = await axios.get(`/api/products/?slug=${slug}`);
		const product = productResponse.data.product;

        // Get product images
        const imagesResponse = await axios.get(`/api/images/?productId=${product.id}`);
        const productImages = imagesResponse.data.product;
        // Get product tags
        const tagsResponse = await axios.get(`/api/tags/?productId=${product.id}`);
        const productTags = tagsResponse.data.product;

		return {product, productImages,productTags};
	} catch (error) {
		console.error('Error:', error);
		return {error};
	}
}) satisfies PageLoad;
