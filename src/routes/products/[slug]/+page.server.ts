import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { getCommentReplies, getThreadByName, getThreadComments } from '../../../service/comment';
import type { Reply } from '../../../models/reply';

export const load = (async ({ params, cookies }) => {
	const { slug } = params;

	const getProductComments = async (commentBaseUrl: string, product: any) => {
		const token = cookies.get('token') as string;
		const thread = await getThreadByName(commentBaseUrl, token, product?.slug as string);
		const comments = await getThreadComments(commentBaseUrl, token, thread?.id as number);
		return comments;
	};

	const getProductReplies = async (commentBaseUrl: string, product: any) => {
		const token = cookies.get('token') as string;
		const comments = await getProductComments(commentBaseUrl, product);
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
		// get product data
		const product = await prisma.product.findUnique({ where: { slug } });
		if (product) {
			const productImages = await prisma.image.findMany({ where: { productId: product?.id } });
			const productTags = await prisma.tag.findMany({ where: { productId: product?.id } });
			//get comment data
			const comments = await getProductComments(commentBaseUrl, product);
			const replies = await getProductReplies(commentBaseUrl, product);

			return {
				commentBaseUrl,
				gatewayBaseUrl,
				product,
				productImages,
				productTags,
				comments,
				replies
			};
		} else return { error: 'Product not found' };
	} catch (error) {
		console.error('Error:', error);
		return { error };
	}
}) satisfies PageServerLoad;
