import type { User } from '../models/user';
import type { PageServerLoad } from './$types';

export const load =  (async ({cookies}) => {
	const gatewayBaseUrl = process.env.GATEWAY_BASE_URL;
	const user : User =JSON.parse(cookies.get('user') as string)

	return { gatewayBaseUrl, user };
}) satisfies PageServerLoad;
