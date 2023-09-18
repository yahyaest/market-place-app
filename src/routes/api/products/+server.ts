import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async (request): Promise<Response> => {
	try {
		const url = new URL(request.url);
		const searchParams = url.searchParams;

		// Transform URLSearchParams into a key-value object
		const queryParams: any = {};
		for (const [key, value] of searchParams.entries()) {
			queryParams[key] = value;
		}

		if (queryParams['id']) {
			queryParams['id'] = +queryParams['id'];
		}

		if (Object.keys(queryParams).length === 0) {
			// If there are no query parameters, retrieve all products
			const products = await prisma.product.findMany();
			return json({ products }, { status: 200 });
		} else {
			// If there are query parameters, retrieve a product by query
			if (queryParams['slug']) {
				const product = await prisma.product.findUnique({
					where: queryParams
				});

				return json({ product: product ? product : [] }, { status: 200 });
			} else {
				const products = await prisma.product.findMany({
					where: queryParams
				});

				return json({ products }, { status: 200 });
			}
		}
	} catch (err) {
		console.error(err);
		throw error(404, { message: 'Products not found' });
	}
};

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
	try {
		const body = await request.json();
		const product = await prisma.product.create({
			data: body
		});

		return json({ product }, { status: 201 });
	} catch (err) {
		console.error(err);
		throw error(400, { message: 'Failed to POST Product' });
	}
};
