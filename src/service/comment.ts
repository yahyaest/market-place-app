import axios from 'axios';
import Cookies from 'js-cookie';
import type { Thread } from '../models/thread';
import type { Comment } from '../models/comment';

export const getThreadByName = async (baseUrl: string, token: string, threadName: string) => {
	try {
		const commentBaseUrl = baseUrl;
		const threadUrl = `${commentBaseUrl}/api/threads/?name=${threadName}`;

		if (!token) {
			throw Error('No token was provided. Failed to get thread data');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(threadUrl, options);
		const thread = response.data[0] as Thread;

		return thread;
	} catch (error: any) {
		console.error('Failed to get thread:', error);
		throw new Error(`Failed to get Thread : ${error}`);
	}
};

export const addThread = async (baseUrl: string, token: string, threadName: string) => {
	try {
		const commentBaseUrl = baseUrl;
		const threadUrl = `${commentBaseUrl}/api/threads`;

		if (!token) {
			throw Error('No token was provided. Failed to post thread');
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
			throw Error('No token was provided. Failed to get thread comments');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(commentUrl, options);
		const comments = response.data.sort(
			(a: Comment, b: Comment) => new Date(b.createdAt) - new Date(a.createdAt)
		);

		return comments;
	} catch (error) {
		console.error('Failed to get thread comments :', error);
		throw new Error(`Failed to get Thread comments : ${error}`);
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
			throw Error('No token was provided. Failed to post comment');
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

export const getCommentReplies = async (baseUrl: string, token: string, commentId: number) => {
	try {
		const commentBaseUrl = baseUrl;
		const commentUrl = `${commentBaseUrl}/api/replies/?commentId=${commentId}`;

		if (!token) {
			throw Error('No token was provided. Failed to get thread replies');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(commentUrl, options);
		const replies = response.data.sort(
			(a: Comment, b: Comment) => new Date(b.createdAt) - new Date(a.createdAt)
		);

		return replies;
	} catch (error) {
		console.error('Failed to get thread replies :', error);
		throw new Error(`Failed to get replies : ${error}`);
	}
};

export const addReply = async (
	baseUrl: string,
	token: string,
	replyContent: string,
	userImage: string,
	commentId: number
) => {
	try {
		const commentBaseUrl = baseUrl;
		const replyUrl = `${commentBaseUrl}/api/replies`;

		if (!token) {
			throw Error('No token was provided. Failed to post reply');
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
			content: replyContent,
			commentId
		};

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.post(replyUrl, payload, options);
		const comment = response.data;

		return comment;
	} catch (error) {
		console.error('Failed to create comment :', error);
	}
};

export const getCommentVotes = async (
	baseUrl: string,
	token: string,
	voteType: 'UP' | 'DOWN',
	commentId: number | null
) => {
	try {
		const commentBaseUrl = baseUrl;
		const voteUrl = `${commentBaseUrl}/api/votes/?commentId=${commentId}&voteType=${voteType}`;

		if (!token) {
			throw Error('No token was provided. Failed to get vote');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(voteUrl, options);
		const votes = response.data;

		return votes.length;
	} catch (error) {
		console.error('Failed to get votes :', error);
		throw new Error(`Failed to get votes : ${error}`);
	}
};

export const getReplyVotes = async (
	baseUrl: string,
	token: string,
	voteType: 'UP' | 'DOWN',
	replyId: number | null
) => {
	try {
		const commentBaseUrl = baseUrl;
		const voteUrl = `${commentBaseUrl}/api/votes/?replyId=${replyId}&voteType=${voteType}`;

		if (!token) {
			throw Error('No token was provided. Failed to get vote');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(voteUrl, options);
		const votes = response.data;

		return votes.length;
	} catch (error) {
		console.error('Failed to get votes :', error);
		throw new Error(`Failed to get votes : ${error}`);
	}
};

export const addVote = async (
	baseUrl: string,
	token: string,
	voteType: 'UP' | 'DOWN',
	commentId: number | null,
	replyId: number | null
) => {
	try {
		const commentBaseUrl = baseUrl;
		const voteUrl = `${commentBaseUrl}/api/votes`;

		if (!token) {
			throw Error('No token was provided. Failed to post vote');
		}

		const user = JSON.parse(Cookies.get('user') as string);

		if (!user) {
			throw Error('Failed to retreive logged user');
		}

		const payload = {
			userEmail: user.email,
			username: user.username,
			userId: user.id,
			voteType,
			commentId,
			replyId
		};

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.post(voteUrl, payload, options);
		const comment = response.data;

		return comment;
	} catch (error) {
		console.error('Failed to create vote :', error);
	}
};

export const deleteVote = async (baseUrl: string, token: string, voteId: number) => {
	try {
		const commentBaseUrl = baseUrl;
		const voteUrl = `${commentBaseUrl}/api/votes/${voteId}`;

		if (!token) {
			throw Error('No token was provided. Failed to delete vote');
		}

		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		return await axios.delete(voteUrl, options);
	} catch (error) {
		console.error('Failed to delete votes :', error);
	}
};
