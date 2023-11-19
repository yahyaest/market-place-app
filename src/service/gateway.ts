import axios from 'axios';
import Cookies from 'js-cookie';
import type { AddUser, User } from '../models/user';

export const register = async (baseUrl: string, payload: AddUser) => {
	try {
		const gatewayBaseUrl = baseUrl;
		const signUpUrl = `${gatewayBaseUrl}/api/auth/signup`;
		const redister = await axios.post(signUpUrl, payload);
		const token = redister.data.access_token;
		if (!token) return false;
		Cookies.set('token', token);
		return true;
	} catch (error) {
		console.error('Error register user:', error);
	}
};

export const login = async (baseUrl: string, email: string, password: string) => {
	try {
		const gatewayBaseUrl = baseUrl;
		const signInUrl = `${gatewayBaseUrl}/api/auth/signin`;
		const login = await axios.post(signInUrl, { email, password });
		const token = login.data.access_token;
		if (!token) return false;
		Cookies.set('token', token);
		return true;
	} catch (error) {
		console.error('Error login:', error);
	}
};

export const logout = (baseUrl: string) => {
	Cookies.remove('token');
	Cookies.remove('user');
};

export const getToken = async (baseUrl: string, email: string, password: string) => {
	try {
		const gatewayBaseUrl = baseUrl;
		const signInUrl = `${gatewayBaseUrl}/api/auth/signin`;
		const login = await axios.post(signInUrl, { email, password });
		const token = login.data.access_token;
		if (!token) return null;
		return token;
	} catch (error) {
		console.error('Failed to get token:', error);
	}
};

export const getCurrentUser = async (baseUrl: string) => {
	try {
		const gatewayBaseUrl = baseUrl;
		const currentUserUrl = `${gatewayBaseUrl}/api/users/me`;
		const token = Cookies.get('token');
		if (!token) {
			throw Error('No token was provided. Failed to get current user data');
		}
		const options: any = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(currentUserUrl, options);
		const user = response.data;
		return user as User;
	} catch (error) {
		console.error('Error fetching current user:', error);
	}
};

export const getUserByEmail = async (baseUrl: string, email: string, token: string) => {
	try {
		// Token need to be of admin user
		const gatewayBaseUrl = baseUrl;
		const currentUserUrl = `${gatewayBaseUrl}/api/users/?email=${email}`;
		if (!token) {
			throw Error('No token was provided. Failed to get current user data');
		}
		const options: any = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(currentUserUrl, options);
		const user = response.data[0];
		return user as User;
	} catch (error) {
		console.error('Error fetching current user:', error);
		alert(error);
	}
};

export const getUsers = async (baseUrl: string) => {
	try {
		const gatewayBaseUrl = baseUrl;
		const currentUserUrl = `${gatewayBaseUrl}/api/users`;

		const response = await axios.get(currentUserUrl);
		const users = response.data;
		return users;
	} catch (error) {
		console.error('Error fetching users:', error);
	}
};

export const uploadImage = async (baseUrl: string, file: string, username: string) => {
	try {
		const gatewayBaseUrl = baseUrl;
		const uploadImageUrl = `${gatewayBaseUrl}/api/images`;

		const token = Cookies.get('token');
		if (!token) {
			console.warn('No token was provided');
		}
		const options: any = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};

		const formData = new FormData();
		formData.append('file', file);
		formData.append('username', username);
		const response = await axios.post(uploadImageUrl, formData, options);
		if (response.status === 201) return response.data;
	} catch (error) {
		console.error('Error uploading image:', error);
	}
};

export const getCurrentUserAvatar = async (baseUrl: string, userToken = null) => {
	try {
		const gatewayBaseUrl = baseUrl;
		const currentUserAvatarUrl = `${gatewayBaseUrl}/api/images/me`;
		let token;
		if (userToken === null) {
		token = Cookies.get('token');
			if (!token) {
				throw Error('No token was provided. Failed to get current user data');
			}
		} else {
		token = userToken;
		}
		const options: any = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(currentUserAvatarUrl, options);
		const image = response.data;
		const imageUrl = `${image.filename}`;
		return imageUrl;
	} catch (error) {
		console.error('Error fetching image:', error);
	}
};

export const getUserAvatar = async (baseUrl: string, username: string, token: string) => {
	// Token need to be of admin user
	try {
		const gatewayBaseUrl = baseUrl;
		const currentUserAvatarUrl = `${gatewayBaseUrl}/api/images/?username=${username}`;
		if (!token) {
			throw Error('No token was provided. Failed to get current user data');
		}
		const options: any = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		const response = await axios.get(currentUserAvatarUrl, options);
		const image = response.data;
		const imageUrl = `${image[0].filename}`;
		return imageUrl;
	} catch (error) {
		console.error('Error fetching image:', error);
	}
};
