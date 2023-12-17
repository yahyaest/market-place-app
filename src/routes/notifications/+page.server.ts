import type { Notification } from '../../models/notification';
import type { User } from '../../models/user';
import { getUserNotifications } from '../../service/notification';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = (async ({ cookies }: any) => {
	try {
		const gatewayBaseUrl = process.env.GATEWAY_BASE_URL;
		const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL as string;
		const user: User = JSON.parse(cookies.get('user') as string);
		const token = cookies.get('token') as string;

		//User Notifications
		let userNotifications: Notification[] = [];
		try {
			userNotifications = await getUserNotifications(notificationBaseUrl, token, user.email);
			userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		} catch (error) {
			console.error('Failed getting user notifications');
		}
		return {
			gatewayBaseUrl,
			notificationBaseUrl,
			user,
			token,
			userNotifications
		};
	} catch (error) {
		console.error('Failed getting current user');
	}
}) satisfies PageServerLoad;
