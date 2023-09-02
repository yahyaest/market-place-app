import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async (): Promise<Response> => {
	try {
		const products = await prisma.product.findMany();
		return json(products);
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

		return json(product);
	} catch (err) {
		console.error(err);
		throw error(400, { message: 'Failed to POST Product' });
	}
};
