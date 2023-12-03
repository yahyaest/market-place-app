import { writable, type Writable } from 'svelte/store';
import type { Notification } from './models/notification';

export const navbarIsLogin: Writable<boolean> = writable(false);
export const navbarNotificationsCount: Writable<number> = writable(0);
export const navbarLatestUserNotifications: Writable<Notification[]> = writable([]);
export const navbarOfferItemsNumber: Writable<number> = writable(0);
export const navbarOfferItemsValue: Writable<number> = writable(0);
