import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

const getUserStoreProducts = async (user: any) => {
	if (user) {
		const userStoreProducts = [];
        const userProducts = await prisma.product.findMany({
            where: { username: user.email  }
        });
		for (const product of userProducts) {
			const productImages = await prisma.image.findMany({
				where: { productId: product.id }
			});

			const productOffers = await prisma.offer.findMany({where:{productId: product.id}})

			const userStoreProduct: any = product;
			userStoreProduct.image = productImages[0].url;
			userStoreProduct.offers = productOffers
			userStoreProducts.push(userStoreProduct);
		}
		return userStoreProducts;
	} else return null;
};

export const load = (async ({ cookies }) => {
	if (!cookies.get('user')) {
		throw redirect(307, `/auth/login`);
	}

	try {
        const user = JSON.parse(cookies.get('user') as string);
        const userStoreProducts = getUserStoreProducts(user)
		return {
			userStoreProducts
		};
	} catch (error: any) {
		console.error('Error:', error);
		return { error: error.message };
	}
}) satisfies PageServerLoad;
