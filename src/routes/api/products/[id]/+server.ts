import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
	try {
		const { id } = params;

		const product = await prisma.product.findUnique({
			where: { id: +id }
		});

		if (!product) {
			return json({ message: 'Product not found' }, { status: 404 });
		}

		return json({ product }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(404, { message: 'Products not found' });
	}
};
