import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	if (cookies.get('user')) {
		throw redirect(307, `/`);
	}
	const gatewayBaseUrl = process.env.GATEWAY_BASE_URL;

	return { gatewayBaseUrl };
}) satisfies PageServerLoad;
