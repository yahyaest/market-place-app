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

export const PATCH: RequestHandler = async (request): Promise<Response> => {
	try {
		const token = request.cookies.get('token');
		if (!token) {
			return json({ message: 'Not Authenticated. No token was provided' }, { status: 401 });
		}

		const { id } = request.params;
		const body = await request.request.json();

		const product = await prisma.product.findUnique({
			where: { id: +id }
		});

		if (!product) {
			return json({ message: 'Product not found' }, { status: 404 });
		}

		const updatedProduct = await prisma.product.update({
			where: { id: +id },
			data: body
		});

		return json({ product: updatedProduct }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(400, { message: 'Failed to update product' });
	}
};
