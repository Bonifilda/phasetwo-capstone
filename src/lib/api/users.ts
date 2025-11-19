// Users API functions

import { apiClient } from './client'
import {
  GetUserByIdResponse,
  GetUserByUsernameResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetUserPostsParams,
  GetUserPostsResponse,
  GetUserStatsResponse,
} from '@/types/api'
import { User } from '@/types'

export const usersApi = {
  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<GetUserByIdResponse>(`/users/${id}`)
    return response.user
  },

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<User> {
    const response = await apiClient.get<GetUserByUsernameResponse>(`/users/username/${username}`)
    return response.user
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<GetUserByIdResponse>('/users/me')
    return response.user
  },

  /**
   * Update user profile
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<UpdateUserResponse>(`/users/${id}`, data)
    return response.user
  },

  /**
   * Update current user profile
   */
  async updateCurrentUser(data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<UpdateUserResponse>('/users/me', data)
    return response.user
  },

  /**
   * Get user's posts
   */
  async getUserPosts(params: GetUserPostsParams): Promise<GetUserPostsResponse> {
    const { userId, ...queryParams } = params
    return apiClient.get<GetUserPostsResponse>(`/users/${userId}/posts`, {
      params: queryParams,
    })
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<GetUserStatsResponse> {
    return apiClient.get<GetUserStatsResponse>(`/users/${userId}/stats`)
  },

  /**
   * Get current user statistics
   */
  async getCurrentUserStats(): Promise<GetUserStatsResponse> {
    return apiClient.get<GetUserStatsResponse>('/users/me/stats')
  },

  /**
   * Delete user account
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  },

  /**
   * Search users
   */
  async searchUsers(query: string, params?: { page?: number; limit?: number }): Promise<User[]> {
    const response = await apiClient.get<{ users: User[] }>('/users/search', {
      params: { query, ...params },
    })
    return response.users
  },
}
