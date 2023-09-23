import axios from 'axios';
import Cookies from 'js-cookie';
import type { Thread } from '../models/thread';

export const getThreadByName = async (baseUrl: string, token: string, threadName: string) => {
	try {
		const commentBaseUrl = baseUrl;
		const threadUrl = `${commentBaseUrl}/api/threads/?name=${threadName}`;

		if (!token) {
			throw Error('No token was provided. Failed to get transaction data');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(threadUrl, options);
		const thread = response.data[0] as Thread;

		return thread;
	} catch (error) {
		console.error('Failed to get thread :', error);
	}
};

export const addThread = async (baseUrl: string, token: string, threadName: string) => {
	try {
		const commentBaseUrl = baseUrl;
		const threadUrl = `${commentBaseUrl}/api/threads`;

		if (!token) {
			throw Error('No token was provided. Failed to get transaction data');
		}

		const user = JSON.parse(Cookies.get('user') as string);

		if (!user) {
			throw Error('Failed to retreive logged user');
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
		console.error('Failed to create thread :', error);
	}
};

export const getThreadComments = async (baseUrl: string, token: string, threadId: number) => {
	try {
		const commentBaseUrl = baseUrl;
		const commentUrl = `${commentBaseUrl}/api/comments/?threadId=${threadId}`;

		if (!token) {
			throw Error('No token was provided. Failed to get transaction data');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(commentUrl, options);
		const comments = response.data.reverse();

		return comments;
	} catch (error) {
		console.error('Failed to get thread comments :', error);
	}
};

export const addComment = async (
	baseUrl: string,
	token: string,
	commentContent: string,
	userImage: string,
	threadId: number
) => {
	try {
		const commentBaseUrl = baseUrl;
		const commentUrl = `${commentBaseUrl}/api/comments`;

		if (!token) {
			throw Error('No token was provided. Failed to get transaction data');
		}

		const user = JSON.parse(Cookies.get('user') as string);

		if (!user) {
			throw Error('Failed to retreive logged user');
		}

		const payload = {
			userEmail: user.email,
			username: user.username,
			userId: user.id,
			userImage,
			content: commentContent,
			threadId
		};

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.post(commentUrl, payload, options);
		const comment = response.data;

		return comment;
	} catch (error) {
		console.error('Failed to create comment :', error);
	}
};
