// Follows API functions

import { apiClient } from './client'
import {
  FollowUserRequest,
  FollowUserResponse,
  UnfollowUserRequest,
  UnfollowUserResponse,
  GetFollowersParams,
  GetFollowersResponse,
  GetFollowingParams,
  GetFollowingResponse,
  CheckFollowStatusResponse,
} from '@/types/api'
import { User } from '@/types'

export const followsApi = {
  /**
   * Follow a user
   */
  async followUser(data: FollowUserRequest): Promise<FollowUserResponse> {
    return apiClient.post<FollowUserResponse>('/follows', data)
  },

  /**
   * Unfollow a user
   */
  async unfollowUser(data: UnfollowUserRequest): Promise<UnfollowUserResponse> {
    return apiClient.delete<UnfollowUserResponse>('/follows', { params: data })
  },

  /**
   * Toggle follow on a user (follow if not following, unfollow if already following)
   */
  async toggleFollow(userId: string): Promise<{ isFollowing: boolean }> {
    const response = await apiClient.post<{ isFollowing: boolean }>(
      `/users/${userId}/toggle-follow`
    )
    return response
  },

  /**
   * Get followers of a user
   */
  async getFollowers(params: GetFollowersParams): Promise<GetFollowersResponse> {
    const { userId, ...queryParams } = params
    return apiClient.get<GetFollowersResponse>(`/users/${userId}/followers`, {
      params: queryParams,
    })
  },

  /**
   * Get users that a user is following
   */
  async getFollowing(params: GetFollowingParams): Promise<GetFollowingResponse> {
    const { userId, ...queryParams } = params
    return apiClient.get<GetFollowingResponse>(`/users/${userId}/following`, {
      params: queryParams,
    })
  },

  /**
   * Check if current user is following a specific user
   */
  async checkFollowStatus(userId: string): Promise<boolean> {
    const response = await apiClient.get<CheckFollowStatusResponse>(
      `/users/${userId}/follow-status`
    )
    return response.isFollowing
  },

  /**
   * Get current user's followers
   */
  async getCurrentUserFollowers(params?: Omit<GetFollowersParams, 'userId'>): Promise<GetFollowersResponse> {
    return apiClient.get<GetFollowersResponse>('/users/me/followers', {
      params,
    })
  },

  /**
   * Get users that current user is following
   */
  async getCurrentUserFollowing(params?: Omit<GetFollowingParams, 'userId'>): Promise<GetFollowingResponse> {
    return apiClient.get<GetFollowingResponse>('/users/me/following', {
      params,
    })
  },

  /**
   * Get suggested users to follow
   */
  async getSuggestedUsers(limit: number = 5): Promise<User[]> {
    const response = await apiClient.get<{ users: User[] }>('/users/suggested', {
      params: { limit },
    })
    return response.users
  },
}
