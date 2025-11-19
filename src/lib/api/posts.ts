// Posts API functions

import { apiClient } from './client'
import {
  GetPostsParams,
  GetPostsResponse,
  GetPostByIdResponse,
  CreatePostRequest,
  CreatePostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  DeletePostResponse,
} from '@/types/api'
import { Post } from '@/types'

export const postsApi = {
  /**
   * Get all posts with optional filters and pagination
   */
  async getPosts(params?: GetPostsParams): Promise<GetPostsResponse> {
    return apiClient.get<GetPostsResponse>('/posts', { params })
  },

  /**
   * Get a single post by ID
   */
  async getPostById(id: string): Promise<Post> {
    const response = await apiClient.get<GetPostByIdResponse>(`/posts/${id}`)
    return response.post
  },

  /**
   * Get a single post by slug
   */
  async getPostBySlug(slug: string): Promise<Post> {
    const response = await apiClient.get<GetPostByIdResponse>(`/posts/slug/${slug}`)
    return response.post
  },

  /**
   * Create a new post
   */
  async createPost(data: CreatePostRequest): Promise<Post> {
    const response = await apiClient.post<CreatePostResponse>('/posts', data)
    return response.post
  },

  /**
   * Update an existing post
   */
  async updatePost(id: string, data: UpdatePostRequest): Promise<Post> {
    const response = await apiClient.put<UpdatePostResponse>(`/posts/${id}`, data)
    return response.post
  },

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<void> {
    await apiClient.delete<DeletePostResponse>(`/posts/${id}`)
  },

  /**
   * Publish a draft post
   */
  async publishPost(id: string): Promise<Post> {
    const response = await apiClient.patch<UpdatePostResponse>(`/posts/${id}/publish`, {
      published: true,
    })
    return response.post
  },

  /**
   * Unpublish a post (convert to draft)
   */
  async unpublishPost(id: string): Promise<Post> {
    const response = await apiClient.patch<UpdatePostResponse>(`/posts/${id}/publish`, {
      published: false,
    })
    return response.post
  },

  /**
   * Get posts by author
   */
  async getPostsByAuthor(
    authorId: string,
    params?: Omit<GetPostsParams, 'authorId'>
  ): Promise<GetPostsResponse> {
    return apiClient.get<GetPostsResponse>('/posts', {
      params: { ...params, authorId },
    })
  },

  /**
   * Get posts by tag
   */
  async getPostsByTag(
    tag: string,
    params?: Omit<GetPostsParams, 'tag'>
  ): Promise<GetPostsResponse> {
    return apiClient.get<GetPostsResponse>('/posts', {
      params: { ...params, tag },
    })
  },

  /**
   * Search posts
   */
  async searchPosts(
    query: string,
    params?: Omit<GetPostsParams, 'search'>
  ): Promise<GetPostsResponse> {
    return apiClient.get<GetPostsResponse>('/posts', {
      params: { ...params, search: query },
    })
  },

  /**
   * Get user's drafts
   */
  async getDrafts(params?: Omit<GetPostsParams, 'published'>): Promise<GetPostsResponse> {
    return apiClient.get<GetPostsResponse>('/posts', {
      params: { ...params, published: false },
    })
  },

  /**
   * Get feed posts (latest, following, recommended)
   */
  async getFeed(type: 'latest' | 'following' | 'recommended' = 'latest', params?: GetPostsParams): Promise<GetPostsResponse> {
    return apiClient.get<GetPostsResponse>(`/posts/feed/${type}`, { params })
  },
}
