import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load = (async ({ params }) => {
	const { slug } = params;

	try {
		const product = await prisma.product.findUnique({ where: { slug } });
		if (product) {
			const productImages = await prisma.image.findMany({ where: { productId: product?.id } });
			const productTags = await prisma.tag.findMany({ where: { productId: product?.id } });
			return { product, productImages, productTags };
		}

		else return{error : "Product not found"}

	
	} catch (error) {
		console.error('Error:', error);
		return { error };
	}
}) satisfies PageServerLoad;
