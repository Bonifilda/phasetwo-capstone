// Likes API functions

import { apiClient } from './client'
import {
  LikePostRequest,
  LikePostResponse,
  UnlikePostRequest,
  UnlikePostResponse,
  GetPostLikesParams,
  GetPostLikesResponse,
  CheckLikeStatusResponse,
} from '@/types/api'
import { Like } from '@/types'

export const likesApi = {
  /**
   * Like a post
   */
  async likePost(data: LikePostRequest): Promise<LikePostResponse> {
    return apiClient.post<LikePostResponse>('/likes', data)
  },

  /**
   * Unlike a post
   */
  async unlikePost(data: UnlikePostRequest): Promise<UnlikePostResponse> {
    return apiClient.delete<UnlikePostResponse>('/likes', { params: data })
  },

  /**
   * Toggle like on a post (like if not liked, unlike if already liked)
   */
  async toggleLike(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const response = await apiClient.post<{ isLiked: boolean; likesCount: number }>(
      `/posts/${postId}/toggle-like`
    )
    return response
  },

  /**
   * Get likes for a post
   */
  async getPostLikes(params: GetPostLikesParams): Promise<GetPostLikesResponse> {
    const { postId, ...queryParams } = params
    return apiClient.get<GetPostLikesResponse>(`/posts/${postId}/likes`, {
      params: queryParams,
    })
  },

  /**
   * Check if current user has liked a post
   */
  async checkLikeStatus(postId: string): Promise<boolean> {
    const response = await apiClient.get<CheckLikeStatusResponse>(
      `/posts/${postId}/like-status`
    )
    return response.isLiked
  },

  /**
   * Get user's liked posts
   */
  async getUserLikedPosts(userId: string, params?: { page?: number; limit?: number }): Promise<Like[]> {
    const response = await apiClient.get<{ likes: Like[] }>(`/users/${userId}/likes`, {
      params,
    })
    return response.likes
  },

  /**
   * Get current user's liked posts
   */
  async getCurrentUserLikedPosts(params?: { page?: number; limit?: number }): Promise<Like[]> {
    const response = await apiClient.get<{ likes: Like[] }>('/users/me/likes', {
      params,
    })
    return response.likes
  },
}
