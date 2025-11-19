// Core type definitions for the Medium Platform

export interface User {
  id: string
  email: string
  name: string | null
  username: string | null
  bio: string | null
  avatar: string | null
  createdAt: Date | string
  updatedAt: Date | string
  _count?: {
    posts?: number
    followers?: number
    following?: number
    comments?: number
    likes?: number
  }
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string | null
  slug: string
  published: boolean
  createdAt: Date | string
  updatedAt: Date | string
  authorId: string
  author?: User
  tags?: Tag[]
  comments?: Comment[]
  likes?: Like[]
  readTime?: string
  _count?: {
    comments?: number
    likes?: number
    tags?: number
  }
}

export interface Tag {
  id: string
  name: string
  posts?: Post[]
  _count?: {
    posts?: number
  }
}

export interface Comment {
  id: string
  content: string
  createdAt: Date | string
  updatedAt: Date | string
  authorId: string
  author?: User
  postId: string
  post?: Post
  parentId: string | null
  replies?: Comment[]
  _count?: {
    replies?: number
  }
}

export interface Like {
  id: string
  userId: string
  user?: User
  postId: string
  post?: Post
}

export interface Follow {
  followerId: string
  followingId: string
  follower?: User
  following?: User
}

// Extended types with additional computed fields
export interface PostWithDetails extends Post {
  author: User
  tags: Tag[]
  isLiked?: boolean
  readTime?: string
}

export interface UserProfile extends User {
  posts: Post[]
  followers: Follow[]
  following: Follow[]
  isFollowing?: boolean
}

// Form types
export interface CreatePostInput {
  title: string
  content: string
  excerpt?: string
  published?: boolean
  tags?: string[]
}

export interface UpdatePostInput {
  title?: string
  content?: string
  excerpt?: string
  published?: boolean
  tags?: string[]
}

export interface CreateCommentInput {
  content: string
  postId: string
  parentId?: string
}

export interface UpdateUserInput {
  name?: string
  username?: string
  bio?: string
  avatar?: string
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  cursor?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
    nextCursor?: string
  }
}

// Filter types
export interface PostFilters {
  authorId?: string
  tag?: string
  published?: boolean
  search?: string
}

export interface UserFilters {
  search?: string
  username?: string
}

// Sort types
export type SortOrder = 'asc' | 'desc'

export interface PostSortOptions {
  field: 'createdAt' | 'updatedAt' | 'title'
  order: SortOrder
}
