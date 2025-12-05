export type Review = {
  id: number | string;
  lojaId?: number | string;
  author: string;
  avatarUrl?: string;
  rating: number;
  text: string;
  createdAt?: string;
  usuarioId?: number;
};

export type ReviewComment = {
  id: number | string;
  reviewId: number | string;
  author: string;
  avatarUrl?: string;
  text: string;
  createdAt?: string;
  usuarioId?: number;
  isOwner?: boolean;
};

export type ReviewThread = {
  review: Review;
  comments: ReviewComment[];
};
