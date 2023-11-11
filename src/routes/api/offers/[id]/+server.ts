import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
	try {
		const { id } = params;

		const offer = await prisma.offer.findUnique({
			where: { id: +id }
		});

		if (!offer) {
			return json({ message: 'Offer not found' }, { status: 404 });
		}

		return json({ offer }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(404, { message: 'Offer not found' });
	}
};


export const PATCH: RequestHandler = async (request): Promise<Response> => {
	try {
		const { id } = request.params;
		const body = await request.request.json();

		const updatedOffer = await prisma.offer.update({
			where: { id: +id },
			data: body
		});

		return json({ offer: updatedOffer }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(400, { message: 'Failed to update offer' });
	}
};

export const DELETE: RequestHandler = async (request): Promise<Response> => {
	try {
		const { id } = request.params;

		await prisma.offer.delete({
			where: { id: +id }
		});

		return json({ message: 'Offer deleted successfully' }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(400, { message: 'Failed to delete offer' });
	}
};