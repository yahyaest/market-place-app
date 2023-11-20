import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { getCommentReplies, getThreadByName, getThreadComments } from '../../../service/comment';
import type { Reply } from '../../../models/reply';
import { getToken, getUserByEmail } from '../../../service/gateway';
import axios from 'axios';

export const load = (async ({ params, cookies }) => {
	const { slug } = params;
	const user = JSON.parse(cookies.get('user') as string);

	const getProductComments = async (commentBaseUrl: string, token: string, product: any) => {
		try {
			const thread = await getThreadByName(commentBaseUrl, token, product?.slug as string);
			const comments = await getThreadComments(commentBaseUrl, token, thread?.id as number);
			return comments;
		} catch (error) {
			console.error(error);
		}
	};

	const getProductReplies = async (commentBaseUrl: string, token: string, product: any) => {
		try {
			const comments = await getProductComments(commentBaseUrl, token, product);
			const replies: { commentId: number; commentReplies: Reply[] }[] = [];
			for (const comment of comments) {
				const commentReplies = await getCommentReplies(commentBaseUrl, token, comment.id);
				replies.push({ commentId: comment.id, commentReplies });
			}
			return replies;
		} catch (error) {
			console.error(error);
		}
	};

	const getUserProductOffer = async (productId: number) => {
		if (user) {
			const username = user.email;
			return await prisma.offer.findUnique({
				where: { username_productId: { username, productId }, status: 'PENDING' }
			});
		} else return null;
	};

	try {
		const commentBaseUrl = process.env.COMMENT_BASE_URL as string;
		const gatewayBaseUrl = process.env.GATEWAY_BASE_URL as string;
		const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL as string;
		const frontBaseUrl = process.env.FRONT_BASE_URL as string;
		// Get app token
		const signinPayload = {
			email: process.env.MARKETPLACE_USERNAME as string,
			password: process.env.MARKETPLACE_PASSWORD as string
		};

		const appToken = await getToken(gatewayBaseUrl, signinPayload.email, signinPayload.password);

		// get product data
		const product = await prisma.product.findUnique({ where: { slug } });
		const productOwnerUser = await getUserByEmail(
			gatewayBaseUrl,
			product?.username as string,
			appToken
		);
		const productOwner = productOwnerUser?.username;
		if (product) {
			const productImages = await prisma.image.findMany({ where: { productId: product?.id } });
			const productTags = await prisma.tag.findMany({ where: { productId: product?.id } });
			//get similar products
			const result = await axios.get(
				`${frontBaseUrl}/api/similar_products/?category=${product.category}&subCategory=${product.subCategory}`
			);
			let similarProducts = result.data.products;
			for (const element of similarProducts) {
				const elementImages = await prisma.image.findMany({ where: { productId: element?.id } });
				const elementTags = await prisma.tag.findMany({ where: { productId: element?.id } });
				element.images = elementImages;
				element.tags = elementTags;
			}
			// remove current product
			similarProducts = similarProducts.filter((element: any) => element.id !== product.id);

			//get comment data
			const comments = await getProductComments(commentBaseUrl, appToken, product);
			const replies = await getProductReplies(commentBaseUrl, appToken, product);

			// get user product offer
			const offer = getUserProductOffer(product.id);

			return {
				commentBaseUrl,
				notificationBaseUrl,
				gatewayBaseUrl,
				appEmail: process.env.MARKETPLACE_USERNAME,
				appPassword: process.env.MARKETPLACE_PASSWORD,
				product,
				productOwner,
				productImages,
				productTags,
				similarProducts,
				comments,
				replies,
				user: user ? user : null,
				offer
			};
		} else return { error: 'Product not found' };
	} catch (error: any) {
		console.error('Error:', error);
		return { error: error.message };
	}
}) satisfies PageServerLoad;
