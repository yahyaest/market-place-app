import type { Tag } from '@prisma/client';
import type { PageServerLoad } from '../$types';
import prisma from '$lib/prisma';
import type { Product } from '../../../models/product';
import { getToken, getUserAvatar, getUserByEmail } from '../../../service/gateway';

const getProductOwnerInfo = async (email: string) => {
	const gatewayBaseUrl = process.env.GATEWAY_BASE_URL as string;

	const signinPayload = {
		email: process.env.MARKETPLACE_USERNAME as string,
		password: process.env.MARKETPLACE_PASSWORD as string
	};

	const appToken = await getToken(gatewayBaseUrl, signinPayload.email, signinPayload.password);

	const productOwnerImage = await getUserAvatar(gatewayBaseUrl, email, appToken);
	const productOwnerUserResult = await getUserByEmail(gatewayBaseUrl, email, appToken);

	const productOwnerUsername = productOwnerUserResult?.username;

	return { ownerUsername: productOwnerUsername, ownerImage: productOwnerImage };
};

const getProductSearchResult = async (query: string) => {
	let productsSearchList: { index: number; data: Product }[] = [];
	let index = 0;
	if (query) {
		// Search products by title
		const productsByTitle: Product[] = await prisma.product.findMany({
			where: { title: { contains: query, mode: 'insensitive' } }
		});

		for (const product of productsByTitle) {
			productsSearchList.push({ index, data: product });
			index++;
		}
		// Search products by Tags
		const tags: Tag[] = await prisma.tag.findMany({
			where: { name: { contains: query, mode: 'insensitive' } }
		});

		for (const tag of tags) {
			const productTag: Product | null = await prisma.product.findUnique({
				where: { id: tag.productId as number }
			});
			productsSearchList.push({ index, data: productTag as Product });
			index++;
		}

		// Search products by description
		const productsByDescription: Product[] = await prisma.product.findMany({
			where: { description: { contains: query, mode: 'insensitive' } }
		});

		for (const product of productsByDescription) {
			productsSearchList.push({ index, data: product });
			index++;
		}

		// Search products by category and subCategory
		const productsByCategory: Product[] = await prisma.product.findMany({
			where: { category: { contains: query, mode: 'insensitive' } }
		});

		for (const product of productsByCategory) {
			productsSearchList.push({ index, data: product });
			index++;
		}

		const productsBySubCategory: Product[] = await prisma.product.findMany({
			where: { subCategory: { contains: query, mode: 'insensitive' } }
		});

		for (const product of productsBySubCategory) {
			productsSearchList.push({ index, data: product });
			index++;
		}
	}

	// Sort and remove duplicate products of productsSearchList
	productsSearchList = productsSearchList.sort((b, a) => a.index - b.index);

	productsSearchList = Object.values(
		productsSearchList.reduce((uniqueObject: Product, item) => {
			(uniqueObject as any)[item.data.id] = item;
			return uniqueObject;
		}, {} as Product)
	) as any;

	productsSearchList = productsSearchList.sort((b, a) => b.index - a.index);

	// Return search result
	const productsSearchResult: Product[] = [];
	for (const element of productsSearchList) {
		const product: Product = element.data;
		// Add product image
		const productImages = await prisma.image.findMany({ where: { productId: product.id } });
		product.imageUrl = productImages[0].url;
		// Add product owner image and name
		const ownerInfo = await getProductOwnerInfo(product.username);
		product.ownerImage = ownerInfo.ownerImage;
		product.ownerName = ownerInfo.ownerUsername;

		// if (!product.sold) {
		// 	productsSearchResult.push(product);
		// }
		productsSearchResult.push(product);

	}

	return productsSearchResult;
};

export const load = (async ({ params }) => {
	const { query } = params;
	try {
		const productsSearchResult = await getProductSearchResult(query);
		return {
			gatewayBaseUrl: process.env.GATEWAY_BASE_URL,
			searchQuery: query,
			productsSearchResult
		};
	} catch (error: any) {
		console.error('Error:', error);
		return { error: error.message };
	}
}) satisfies PageServerLoad;
