
export interface Offer {
	id: number;
	createdAt: Date;
	updatedAt: Date;
 username: string,
 productTitle: string,
 productOwner: string,
 productId: number,
 status: "PENDING" | "ACCEPTED" | "REJECTED",
 amount:number,
	productIsSold?:boolean
}