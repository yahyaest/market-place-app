import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import type { User } from '../../../../models/user';

export const GET: RequestHandler = async (request): Promise<Response> => {
	try {
		const { id } = request.params;
		const token = request.cookies.get('token');
		if (!token) {
			return json({ message: 'Not Authenticated. No token was provided' }, { status: 401 });
		}
		const user: User = JSON.parse(request.cookies.get('user') as string);

		const offer = await prisma.offer.findUnique({
			where: { id: +id }
		});

		if (!offer) {
			return json({ message: 'Offer not found' }, { status: 404 });
		}

		if (user.role !== 'ADMIN' && offer.username !== user.email) {
			return json({ message: 'Unauthorized. Offer belongs to another user.' }, { status: 403 });
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
		const token = request.cookies.get('token');
		console.log(token);
		if (!token) {
			return json({ message: 'Not Authenticated. No token was provided' }, { status: 401 });
		}
		const user: User = JSON.parse(request.cookies.get('user') as string);

		const updatedOffer = await prisma.offer.update({
			where: { id: +id },
			data: body
		});

		if (user.role !== 'ADMIN' && updatedOffer.username !== user.email) {
			return json({ message: 'Unauthorized. Offer belongs to another user.' }, { status: 403 });
		}

		return json({ offer: updatedOffer }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(400, { message: 'Failed to update offer. Offer not found' });
	}
};

export const DELETE: RequestHandler = async (request): Promise<Response> => {
	try {
		const { id } = request.params;
		const token = request.cookies.get('token');
		if (!token) {
			return json({ message: 'Not Authenticated. No token was provided' }, { status: 401 });
		}
		const user: User = JSON.parse(request.cookies.get('user') as string);

		const offer = await prisma.offer.findUnique({
			where: { id: +id }
		});

		if (!offer) {
			return json({ message: 'Offer not found' }, { status: 404 });
		}

		if (user.role !== 'ADMIN' && offer.username !== user.email) {
			return json({ message: 'Unauthorized. Offer belongs to another user.' }, { status: 403 });
		}

		await prisma.offer.delete({
			where: { id: +id }
		});

		return json({ message: 'Offer deleted successfully' }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(400, { message: 'Failed to delete offer.' });
	}
};