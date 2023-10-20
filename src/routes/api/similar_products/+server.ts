import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import type { Product, Tag } from '@prisma/client';

export const GET: RequestHandler = async (request): Promise<Response> => {
	try {
		const url = new URL(request.url);
		const searchParams = url.searchParams;

		// Transform URLSearchParams into a key-value object
		const queryParams: any = {};
		for (const [key, value] of searchParams.entries()) {
			queryParams[key] = value;
		}

		if (
			!Object.keys(queryParams).includes('category') &&
			!Object.keys(queryParams).includes('subCategory')
		) {
			throw error(404, {
				message: 'Products not found, queryParams should include category or subCategory'
			});
		}

		// If there are query parameters, retrieve a product by query
		let productsSearchList: { index: number; data: Product }[] = [];
		let index = 0;

		if (queryParams['category'] && queryParams['subCategory']) {
			// Search products by category and subCategory
			const productsByCategory: Product[] = await prisma.product.findMany({
				where: {
					category: { equals: queryParams['category'], mode: 'insensitive' },
					subCategory: { equals: queryParams['subCategory'], mode: 'insensitive' }
				}
			});

			for (const product of productsByCategory) {
				productsSearchList.push({ index, data: product });
				index++;
			}
		}

		if (queryParams['category']) {
			// Search products by category and subCategory
			const productsByCategory: Product[] = await prisma.product.findMany({
				where: { category: { equals: queryParams['category'], mode: 'insensitive' } }
			});

			for (const product of productsByCategory) {
				productsSearchList.push({ index, data: product });
				index++;
			}
		}
 
		// Sort and remove duplicate products of productsSearchList
		productsSearchList = productsSearchList.sort((b,a)=> a.index - b.index);

		productsSearchList = Object.values(
			productsSearchList.reduce((uniqueObject: Product, item) => {
				(uniqueObject as any)[item.data.id] = item;
				return uniqueObject;
			}, {} as Product)
			) as any;
			productsSearchList = productsSearchList.sort((b,a)=> b.index - a.index);

			// Return search result
   const productsSearchResult:  Product [] = [];
			for (const element of productsSearchList) {
				productsSearchResult.push(element.data);
			}
		return json({ products: productsSearchResult }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(404, { message: err as string });
	}
};
