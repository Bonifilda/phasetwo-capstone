// API request and response types

import { 
  Post, 
  User, 
  Comment, 
  Tag, 
  Like, 
  Follow,
  PaginatedResponse,
  PostFilters,
  PaginationParams,
  PostSortOptions
} from './index'

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Posts API
export interface GetPostsParams extends PaginationParams, PostFilters {
  sort?: PostSortOptions
}

export interface GetPostsResponse extends PaginatedResponse<Post> {}

export interface GetPostByIdResponse {
  post: Post
}

export interface CreatePostRequest {
  title: string
  content: string
  excerpt?: string
  published?: boolean
  tags?: string[]
}

export interface CreatePostResponse {
  post: Post
}

export interface UpdatePostRequest {
  title?: string
  content?: string
  excerpt?: string
  published?: boolean
  tags?: string[]
}

export interface UpdatePostResponse {
  post: Post
}

export interface DeletePostResponse {
  success: boolean
  message: string
}

// Comments API
export interface GetCommentsParams extends PaginationParams {
  postId: string
  parentId?: string
}

export interface GetCommentsResponse extends PaginatedResponse<Comment> {}

export interface CreateCommentRequest {
  content: string
  postId: string
  parentId?: string
}

export interface CreateCommentResponse {
  comment: Comment
}

export interface UpdateCommentRequest {
  content: string
}

export interface UpdateCommentResponse {
  comment: Comment
}

export interface DeleteCommentResponse {
  success: boolean
  message: string
}

// Users API
export interface GetUserByIdResponse {
  user: User
}

export interface GetUserByUsernameResponse {
  user: User
}

export interface UpdateUserRequest {
  name?: string
  username?: string
  bio?: string
  avatar?: string
}

export interface UpdateUserResponse {
  user: User
}

export interface GetUserPostsParams extends PaginationParams {
  userId: string
  published?: boolean
}

export interface GetUserPostsResponse extends PaginatedResponse<Post> {}

export interface GetUserStatsResponse {
  postsCount: number
  draftsCount: number
  followersCount: number
  followingCount: number
  totalLikes: number
  totalViews: number
}

// Tags API
export interface GetTagsParams extends PaginationParams {
  search?: string
}

export interface GetTagsResponse extends PaginatedResponse<Tag> {}

export interface GetPostsByTagParams extends PaginationParams {
  tag: string
}

export interface GetPostsByTagResponse extends PaginatedResponse<Post> {}

export interface CreateTagRequest {
  name: string
}

export interface CreateTagResponse {
  tag: Tag
}

// Likes API
export interface LikePostRequest {
  postId: string
}

export interface LikePostResponse {
  like: Like
  likesCount: number
}

export interface UnlikePostRequest {
  postId: string
}

export interface UnlikePostResponse {
  success: boolean
  likesCount: number
}

export interface GetPostLikesParams extends PaginationParams {
  postId: string
}

export interface GetPostLikesResponse extends PaginatedResponse<Like> {}

export interface CheckLikeStatusResponse {
  isLiked: boolean
}

// Follows API
export interface FollowUserRequest {
  userId: string
}

export interface FollowUserResponse {
  follow: Follow
}

export interface UnfollowUserRequest {
  userId: string
}

export interface UnfollowUserResponse {
  success: boolean
}

export interface GetFollowersParams extends PaginationParams {
  userId: string
}

export interface GetFollowersResponse extends PaginatedResponse<User> {}

export interface GetFollowingParams extends PaginationParams {
  userId: string
}

export interface GetFollowingResponse extends PaginatedResponse<User> {}

export interface CheckFollowStatusResponse {
  isFollowing: boolean
}

// Search API
export interface SearchParams extends PaginationParams {
  query: string
  type?: 'posts' | 'users' | 'tags' | 'all'
}

export interface SearchResponse {
  posts?: Post[]
  users?: User[]
  tags?: Tag[]
}

// Upload API
export interface UploadImageRequest {
  file: File
  folder?: string
}

export interface UploadImageResponse {
  url: string
  publicId: string
  width: number
  height: number
}

// Feed API
export interface GetFeedParams extends PaginationParams {
  type?: 'latest' | 'following' | 'recommended'
}

export interface GetFeedResponse extends PaginatedResponse<Post> {}

// Analytics API (optional)
export interface GetPostAnalyticsResponse {
  views: number
  likes: number
  comments: number
  shares: number
  viewsOverTime: Array<{ date: string; count: number }>
}
