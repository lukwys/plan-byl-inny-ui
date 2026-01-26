type CommentStatus = "pending_email" | "published" | "rejected";

export type CommentModel = {
  id: number;
  documentId: string;
  authorName: string;
  email: string;
  body: string;
  commentStatus: CommentStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};
