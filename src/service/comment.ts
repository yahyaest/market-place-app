import axios from 'axios';
import Cookies from 'js-cookie';

export const addThread = async (baseUrl: string, token: string, threadName: string) => {
	try {
		const commentBaseUrl = baseUrl;
		const threadUrl = `${commentBaseUrl}/api/threads`;

		if (!token) {
			throw Error('No token was provided. Failed to get transaction data');
		}

		const user = JSON.parse(Cookies.get('user') as string);

		if (!user) {
			throw Error('FAiled to retreive logged user');
		}

		const payload = { createdBy: user.email, name: threadName };

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.post(threadUrl, payload, options);
		const thread = response.data;

		return thread;
	} catch (error) {
		console.error('FAiled to create thread :', error);
	}
};
