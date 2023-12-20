import axios from 'axios';
import { getToken, getUserByEmail } from './gateway';

export const addUserNotification = async (baseUrl: string, token: string, payload: any) => {
	try {
		const notificationBaseUrl = baseUrl;
		const notificationUrl = `${notificationBaseUrl}/api/notifications`;

		if (!token) {
			throw Error('No token was provided. Failed to post notification');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.post(notificationUrl, payload, options);
		const notification = response.data;

		return notification;
	} catch (error) {
		console.error('Failed to create notification :', error);
	}
};

export const addProductOwnerNotification = async (
	baseUrl: string,
	gatewayUrl: string,
	appSigninPayload: any,
	productOwner: string,
	data: any
) => {
	try {
		const notificationBaseUrl = baseUrl;
		const notificationUrl = `${notificationBaseUrl}/api/notifications`;

		// Get Product Owner User
		const gatewayBaseUrl = gatewayUrl;
		const signinPayload = appSigninPayload;

		const appToken = await getToken(gatewayBaseUrl, signinPayload.email, signinPayload.password);

		if (!appToken) {
			throw Error('No token was provided. Failed to post notification');
		}

		const productOwnerUser = await getUserByEmail(gatewayBaseUrl, productOwner, appToken);
		// const productOwnerImage = await getUserAvatar(gatewayBaseUrl, productOwnerUser?.email as string ,appToken)

		// Post notification
		const options = {
			headers: {
				Authorization: `Bearer ${appToken}`
			}
		};

		const payload = {
			userEmail: productOwnerUser?.email,
			username: productOwnerUser?.username,
			userImage: data.userImage,
			userId: productOwnerUser?.id,
			title: data.title,
			message: data.message,
			seen: false
		};

		const response = await axios.post(notificationUrl, payload, options);
		const notification = response.data;

		return notification;
	} catch (error) {
		console.error('Failed to create notification :', error);
	}
};

export const getUserNotifications = async (baseUrl: string, token: string, email: string) => {
	try {
		const notificationBaseUrl = baseUrl;
		const notificationUrl = `${notificationBaseUrl}/api/notifications/?userEmail=${email}`;

		if (!token) {
			throw Error('No token was provided. Failed to post notification');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(notificationUrl, options);
		const notification = response.data;

		return notification;
	} catch (error) {
		console.error('Failed to get notifications :', error);
	}
};

export const updateNotification = async (
	baseUrl: string,
	token: string,
	notificationId: number,
	payload: any
) => {
	try {
		const notificationBaseUrl = baseUrl;
		const notificationUrl = `${notificationBaseUrl}/api/notifications/${notificationId}`;

		if (!token) {
			throw Error('No token was provided. Failed to post notification');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.patch(notificationUrl, payload, options);
		const notification = response.data;

		return notification;
	} catch (error) {
		console.error('Failed to update notification :', error);
	}
};

export const updateBulkNotification = async (
	baseUrl: string,
	token: string,
	payload: any
) => {
	try {
		const notificationBaseUrl = baseUrl;
		const notificationUrl = `${notificationBaseUrl}/api/bulk_notifications`;

		if (!token) {
			throw Error('No token was provided. Failed to post notification');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.patch(notificationUrl, payload, options);
		const notifications = response.data;

		return notifications;
	} catch (error) {
		console.error('Failed to update notifications :', error);
	}
};

export const deleteNotification = async (
	baseUrl: string,
	token: string,
	notificationId: number
) => {
	try {
		const notificationBaseUrl = baseUrl;
		const notificationUrl = `${notificationBaseUrl}/api/notifications/${notificationId}`;

		if (!token) {
			throw Error('No token was provided. Failed to post notification');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.delete(notificationUrl, options);
		const notification = response.data;

		return notification;
	} catch (error) {
		console.error('Failed to delete notification :', error);
	}
};
