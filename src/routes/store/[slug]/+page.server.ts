import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { getCurrentUserAvatar, getToken, getUserAvatar, getUserByEmail } from '../../../service/gateway';

const getProductOffers = async (user: any, product: any, token: string) => {
	if (user) {
		const gatewayBaseUrl = process.env.GATEWAY_BASE_URL as string;
		const productsOffers = [];
		const offers = await prisma.offer.findMany({ where: { productId: product?.id } });
		for (const offer of offers) {
			const userOffer: any = offer;
			const offerUser = await getUserByEmail(gatewayBaseUrl, offer?.username as string, token);
			const offerUserImage = await getUserAvatar(gatewayBaseUrl, offerUser?.email as string, token);
            userOffer.userId = offerUser?.id;
			userOffer.email = offerUser?.email;
			userOffer.username = offerUser?.username;
			userOffer.userImage = offerUserImage;

            productsOffers.push(userOffer)
		}
		return productsOffers;
	} else return null;
};

export const load = (async ({ params, cookies }) => {
	if (!cookies.get('user')) {
		throw redirect(307, `/auth/login`);
	}

	try {
		const gatewayBaseUrl = process.env.GATEWAY_BASE_URL as string;
        const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL as string;
		// Get app token
		const signinPayload = {
			email: process.env.MARKETPLACE_USERNAME as string,
			password: process.env.MARKETPLACE_PASSWORD as string
		};

		const appToken = await getToken(gatewayBaseUrl, signinPayload.email, signinPayload.password);
		const { slug } = params;
		const user = JSON.parse(cookies.get('user') as string);
        const userImage = await getCurrentUserAvatar(gatewayBaseUrl, cookies.get("token") as any);
		const product = await prisma.product.findUnique({ where: { slug } });
		const productOffers = getProductOffers(user, product, appToken);
		return {
            gatewayBaseUrl,
            notificationBaseUrl,
            appEmail: process.env.MARKETPLACE_USERNAME,
			appPassword: process.env.MARKETPLACE_PASSWORD,
            user,
            userImage,
            product,
			productOffers
		};
	} catch (error: any) {
		console.error('Error:', error);
		return { error: error.message };
	}
}) satisfies PageServerLoad;
