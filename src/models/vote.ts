export interface Vote {
	id: number;
	createdAt: string;
	updatedAt: string;
	userEmail: string;
	username: string;
	userImage: string;
	userId: number;
	voteType: 'UP' | 'DOWN';
	commentId?: number;
	replyId?: number;
}
