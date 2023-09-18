import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';
import { promises as fsPromises } from 'fs';

const prisma = new PrismaClient();

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

		let images;
		if (Object.keys(queryParams).length === 0) {
			// If there are no query parameters, retrieve all images
			images = await prisma.image.findMany();
		} else {
			// If there are query parameters, retrieve a image by query
			images = await prisma.image.findMany({
				where: queryParams
			});
		}
		return json({ images }, { status: 200 });
	} catch (err) {
		console.error(err);
		throw error(404, { message: 'images not found' });
	}
};

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
	try {
		const body = await request.formData();

		console.log('body : ', body);

		if (!body || !body.get('file')) {
			return json({
				status: 400,
				body: 'No file provided'
			});
		}

		const file = body.get('file') as File;
		const extension = file.type.split('/')[1];

		// Generate a unique filename based on the current timestamp
		const timestamp = Date.now();
		const filename = `${timestamp}.${extension}`;
		const filePath = `static/images/products/${filename}`;

		const fileBuffer = await file.arrayBuffer();
		await fsPromises.writeFile(filePath, Buffer.from(fileBuffer));

		// Save the image URL to the database using Prisma
		const payload = {
			username: body.get('username'),
			productTitle: body.get('productTitle'),
			productId: parseInt(body.get('productId') as string),
			name: body.get('name'),
			url: `/images/products/${filename}`
		};
		const image = await prisma.image.create({
			data: payload
		});

		return json({ image }, { status: 201 });
	} catch (err) {
		console.log(err);
		throw error(400, { message: 'Failed to POST Product' });
	}
};
