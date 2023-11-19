import type { User } from '../models/user';
import { getCurrentUserAvatar } from '../service/gateway';
import type { PageServerLoad } from './$types';

export const load : PageServerLoad = (async ({ cookies } : any) => {
	try {
		const gatewayBaseUrl = process.env.GATEWAY_BASE_URL;
		const user: User = JSON.parse(cookies.get('user') as string);
		const token = cookies.get('token') as string;
		let userImage = null;
		if (user && token) {
			userImage = await getCurrentUserAvatar(gatewayBaseUrl as string, token as any);
		}

		return { gatewayBaseUrl, user, token, userImage };
	} catch (error) {
		console.error('Failed getting current user');
	}
}) satisfies PageServerLoad;
