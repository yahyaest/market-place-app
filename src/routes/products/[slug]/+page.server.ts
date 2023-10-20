import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { getCommentReplies, getThreadByName, getThreadComments } from '../../../service/comment';
import type { Reply } from '../../../models/reply';
import { getToken } from '../../../service/gateway';
import type { Product } from '@prisma/client';
import axios from 'axios';

export const load = (async ({ params, cookies }) => {
	const { slug } = params;

	const getProductComments = async (commentBaseUrl: string, token: string, product: any) => {
		// const token = cookies.get('token') as string;
		const thread = await getThreadByName(commentBaseUrl, token, product?.slug as string);
		const comments = await getThreadComments(commentBaseUrl, token, thread?.id as number);
		return comments;
	};

	const getProductReplies = async (commentBaseUrl: string, token: string, product: any) => {
		// const token = cookies.get('token') as string;
		const comments = await getProductComments(commentBaseUrl, token, product);
		const replies: { commentId: number; commentReplies: Reply[] }[] = [];
		for (const comment of comments) {
			const commentReplies = await getCommentReplies(commentBaseUrl, token, comment.id);
			replies.push({ commentId: comment.id, commentReplies });
		}
		return replies;
	};

	try {
		const commentBaseUrl = process.env.COMMENT_BASE_URL as string;
		const gatewayBaseUrl = process.env.GATEWAY_BASE_URL as string;
		const frontBaseUrl = process.env.FRONT_BASE_URL as string;
		// Get app token
		const signinPayload = {
			email: process.env.MARKETPLACE_USERNAME as string,
			password: process.env.MARKETPLACE_PASSWORD as string
		};

		const appToken = await getToken(gatewayBaseUrl, signinPayload.email, signinPayload.password);

		// get product data
		const product = await prisma.product.findUnique({ where: { slug } });
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

			return {
				commentBaseUrl,
				gatewayBaseUrl,
				appEmail: process.env.MARKETPLACE_USERNAME,
				appPassword: process.env.MARKETPLACE_PASSWORD,
				product,
				productImages,
				productTags,
				similarProducts,
				comments,
				replies
			};
		} else return { error: 'Product not found' };
	} catch (error: any) {
		console.error('Error:', error);
		return { error: error.message };
	}
}) satisfies PageServerLoad;
