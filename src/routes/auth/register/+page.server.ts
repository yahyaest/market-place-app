import type { PageServerLoad } from './$types';

export const load = (async () => {
	const gatewayBaseUrl = process.env.GATEWAY_BASE_URL;

	return { gatewayBaseUrl };
}) satisfies PageServerLoad;
