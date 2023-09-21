import type { PageServerLoad } from './$types';

export const load = (async () => {
	const commentBaseUrl = process.env.COMMENT_BASE_URL;

	return { commentBaseUrl };
}) satisfies PageServerLoad;
