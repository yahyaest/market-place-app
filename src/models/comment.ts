export interface Comment {
	id: number;
	createdAt: string;
	updatedAt: string;
	userEmail: string;
	userId: number;
	content: string;
	threadId: number;
}
