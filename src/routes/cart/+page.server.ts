import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { getCurrentUserAvatar, getToken, getUserAvatar, getUserByEmail } from '../../service/gateway';
import type { PageServerLoad } from './$types';

const getUserOffers = async (gatewayBaseUrl: string, appToken: string, user: any) => {
	if (user) {
		const userOffers = [];
		const username = user.email;
		const offers = await prisma.offer.findMany({
			where: { username }
		});
		for (const offer of offers) {
			const offerProduct = await prisma.product.findUnique({
				where: { id: offer.productId as number }
			});
			const productImages = await prisma.image.findMany({
				where: { productId: offer.productId }
			});
			const productOwnerUser = await getUserByEmail(gatewayBaseUrl, offer.productOwner, appToken);
			const productOwnerImage = await getUserAvatar(
				gatewayBaseUrl,
				productOwnerUser?.email as string,
				appToken
			);

			const userOffer: any = offer;
			userOffer.image = productImages[0].url;
			userOffer.productCategory = offerProduct?.category;
			userOffer.productOwnerUsername = productOwnerUser?.username;
			userOffer.productOwnerImage = productOwnerImage;
			userOffer.productPrice = offerProduct?.price;
			userOffers.push(userOffer);
		}
		return userOffers;
	} else return null;
};

export const load = (async ({ cookies }) => {
	if (!cookies.get('user')) {
		throw redirect(307, `/auth/login`);
	}

	try {
		const gatewayBaseUrl = process.env.GATEWAY_BASE_URL as string;
		const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL as string;
		const signinPayload = {
			email: process.env.MARKETPLACE_USERNAME as string,
			password: process.env.MARKETPLACE_PASSWORD as string
		};
		const appToken = await getToken(gatewayBaseUrl, signinPayload.email, signinPayload.password);
		const userToken = cookies.get("token") as any
		const user = JSON.parse(cookies.get('user') as string);
		const userOffers = getUserOffers(gatewayBaseUrl, appToken, user);
		const userImage = await getCurrentUserAvatar(gatewayBaseUrl, userToken);
		return {
			gatewayBaseUrl,
			notificationBaseUrl,
			appEmail: process.env.MARKETPLACE_USERNAME,
			appPassword: process.env.MARKETPLACE_PASSWORD,
			user,
			userOffers,
			userImage
		};
	} catch (error: any) {
		console.error('Error:', error);
		return { error: error.message };
	}
}) satisfies PageServerLoad;
