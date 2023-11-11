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
		if (queryParams['productId']) {
			queryParams['productId'] = +queryParams['productId'];
		}

		let offers;
		if (Object.keys(queryParams).length === 0) {
			// If there are no query parameters, retrieve all offers
			offers = await prisma.offer.findMany();
		} else {
			// If there are query parameters, retrieve a offer by query
			offers = await prisma.offer.findMany({
				where: queryParams
			});
		}
		return json({ offers }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(404, { message: 'offers not found' });
	}
};

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
	try {
		const body = await request.json();
		const existingOffer = await prisma.offer.findMany({
			where: { productId: body.productId, username: body.username }
		});
		if (existingOffer.length > 0) {
			throw error(400, { message: 'An offer is already made by the same user!' });
		}
		if (body.productOwner === body.username) {
			throw error(400, { message: 'Product owner cannot make an offer of his own product!' });
		}
		const offer = await prisma.offer.create({
			data: body
		});

		return json({ offer }, { status: 201 });
	} catch (err: any) {
		console.error(err);
		throw error(400, { message: err });
	}
};
