import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async (request): Promise<Response> => {
	try {
		const url = new URL(request.url);
		const searchParams = url.searchParams;

		const token = request.cookies.get('token');
		if (!token) {
			return json({ message: 'Not Authenticated. No token was provided' }, { status: 401 });
		}

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

		let tags;
		if (Object.keys(queryParams).length === 0) {
			// If there are no query parameters, retrieve all tags
			tags = await prisma.tag.findMany();
		} else {
			// If there are query parameters, retrieve a tag by query
			tags = await prisma.tag.findMany({
				where: queryParams
			});
		}
		return json({ tags }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(404, { message: 'tags not found' });
	}
};

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
	try {
		const body = await request.json();
		const tag = await prisma.tag.create({
			data: body
		});

		return json({ tag }, { status: 201 });
	} catch (err) {
		console.error(err);
		throw error(400, { message: 'Failed to POST Tag' });
	}
};
