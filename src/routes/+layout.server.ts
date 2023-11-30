import prisma from '$lib/prisma';
import type { Notification } from '../models/notification';
import type { User } from '../models/user';
import { getCurrentUserAvatar } from '../service/gateway';
import { getUserNotifications } from '../service/notification';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ cookies }: any) => {
	try {
		const gatewayBaseUrl = process.env.GATEWAY_BASE_URL;
		const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL as string;
		const user: User = JSON.parse(cookies.get('user') as string);
		const token = cookies.get('token') as string;
		let userImage = null;
		if (user && token) {
			userImage = await getCurrentUserAvatar(gatewayBaseUrl as string, token as any);
		}
		// Users Offers
		const offers = await prisma.offer.findMany({
			where: { username: user.email }
		});
		const offerItemsNumber = offers.length;
		let offerItemsValue = 0;
		for (const offer of offers) {
			offerItemsValue = offerItemsValue + offer.amount;
		}
		//User Notifications
		const userNotifications: Notification[] = await getUserNotifications(
			notificationBaseUrl,
			token,
			user.email
		);
		const notificationsNumber = userNotifications.filter(
			(notification) => notification.seen === false
		).length;
		const latestUserNotifications = userNotifications
			.filter((notification) => notification.seen === false)
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.slice(0, 5);

		console.log(latestUserNotifications[0].createdAt);

		return {
			gatewayBaseUrl,
			notificationBaseUrl,
			user,
			token,
			userImage,
			notificationsNumber,
			latestUserNotifications,
			offerItemsNumber,
			offerItemsValue
		};
	} catch (error) {
		console.error('Failed getting current user');
	}
}) satisfies PageServerLoad;
