import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import type { Tag } from '@prisma/client';
import type { Product } from '../../../models/product';

export const GET: RequestHandler = async (request): Promise<Response> => {
	try {
		const url = new URL(request.url);
		const searchParams = url.searchParams;

		// Transform URLSearchParams into a key-value object
		const queryParams: any = {};
		for (const [key, value] of searchParams.entries()) {
			queryParams[key] = value;
		}

		if (!Object.keys(queryParams).includes('search_query')) {
			throw error(404, { message: 'Products not found, queryParams should include search_query' });
		}

		// If there are query parameters, retrieve a product by query
		let productsSearchList: { index: number; data: Product }[] = [];
		let index = 0;
		if (queryParams['search_query']) {
			// Search products by title
			const productsByTitle: Product[] = await prisma.product.findMany({
				where: { title: { contains: queryParams['search_query'], mode: 'insensitive' } }
			});

			for (const product of productsByTitle) {
				productsSearchList.push({ index, data: product });
				index++;
			}
			// Search products by Tags
			const tags: Tag[] = await prisma.tag.findMany({
				where: { name: { contains: queryParams['search_query'], mode: 'insensitive' } }
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
				where: { description: { contains: queryParams['search_query'], mode: 'insensitive' } }
			});

			for (const product of productsByDescription) {
				productsSearchList.push({ index, data: product });
				index++;
			}

			// Search products by category and subCategory
			const productsByCategory: Product[] = await prisma.product.findMany({
				where: { category: { contains: queryParams['search_query'], mode: 'insensitive' } }
			});

			for (const product of productsByCategory) {
				productsSearchList.push({ index, data: product });
				index++;
			}

			const productsBySubCategory: Product[] = await prisma.product.findMany({
				where: { subCategory: { contains: queryParams['search_query'], mode: 'insensitive' } }
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
			productsSearchResult.push(product);
		}
		return json({ products: productsSearchResult }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(404, { message: err as string });
	}
};
