import { writable, type Writable } from "svelte/store";
import type { Notification } from "./models/notification";

export const navbarNotificationsCount : Writable<number> = writable(0);
export const navbarLatestUserNotifications : Writable<Notification[]> = writable([]);

