import type { ProductImage } from "./productImage";
import type { ProductTag } from "./productTag";

export interface Product {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	title: string;
	slug: string;
	username: string;
	description: string;
	price: number;
	category: string;
	subCategory: string;
	phone: string;
	country: string;
	state: string;
	city?: string | null;
	images?: ProductImage[];
	tags?: ProductTag[];
}
