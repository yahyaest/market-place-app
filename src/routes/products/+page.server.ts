import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import type { Product } from '../../models/product';

export const load = (async () => {
	try {
		const colors = [
			'red',
			'grey',
			'orange',
			'amber',
			'yellow',
			'green',
			'yellow',
			'emerald',
			'teal',
			'sean',
			'sky',
			'blue',
			'rose'
		];
		const colorOpacities = ['300', '400', '500', '600'];
		const generateColorCombinations = (colors: string[], colorOpacities: string[]) => {
			const combinations = [];

			for (const color of colors) {
				for (const opacity of colorOpacities) {
					const className = `bg-${color}-${opacity}`;
					combinations.push(className);
				}
			}

			// Shuffle the combinations randomly
			for (let i = combinations.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[combinations[i], combinations[j]] = [combinations[j], combinations[i]];
			}

			const result = combinations.map((value, index) => ({
				index: index,
				value: value
			}));

			return result;
		};

		const colorsBgCombinations = generateColorCombinations(colors, colorOpacities);

		// get products
		const products = (await prisma.product.findMany()) as Product[];
		if (products) {
			for (const product of products) {
				const productImages = await prisma.image.findMany({ where: { productId: product?.id } });
				const productTags = await prisma.tag.findMany({ where: { productId: product?.id } });
				product.images = productImages;
				product.tags = productTags;
			}

			return {
				products: products.sort((a, b) => b.createdAt - a.createdAt), colorsBgCombinations
			};
		} else return { error: 'Products not found' };
	} catch (error: any) {
		console.error('Error:', error);
		return { error: error.message };
	}
}) satisfies PageServerLoad;
