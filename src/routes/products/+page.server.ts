import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import type { Product } from '../../models/product';

export const load = (async () => {
	try {
		const products = await prisma.product.findMany() as Product[];
		if (products) {
			for (const product of products) {
				const productImages = await prisma.image.findMany({ where: { productId: product?.id } });
				const productTags = await prisma.tag.findMany({ where: { productId: product?.id } });
				product.images = productImages;
				product.tags = productTags;
			}

			return {
				products
			};
		} else return { error: 'Products not found' };
	} catch (error: any) {
		console.error('Error:', error);
		return { error: error.message };
	}
}) satisfies PageServerLoad;
