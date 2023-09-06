import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async (): Promise<Response> => {
	try {
		const tags = await prisma.tag.findMany();
		return json(tags);
	} catch (err) {
		console.error(err);
		throw error(404, { message: 'Tags not found' });
	}
};

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
	try {
		const body = await request.json();
		const tag = await prisma.tag.create({
			data: body
		});

		return json({tag}, {status:201});
	} catch (err) {
		console.error(err);
		throw error(400, { message: 'Failed to POST Tag' });
	}
};
