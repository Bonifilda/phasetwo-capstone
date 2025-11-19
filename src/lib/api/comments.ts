// Comments API functions

import { apiClient } from './client'
import {
  GetCommentsParams,
  GetCommentsResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  DeleteCommentResponse,
} from '@/types/api'
import { Comment } from '@/types'

export const commentsApi = {
  /**
   * Get comments for a post
   */
  async getComments(params: GetCommentsParams): Promise<GetCommentsResponse> {
    return apiClient.get<GetCommentsResponse>('/comments', { params })
  },

  /**
   * Get a single comment by ID
   */
  async getCommentById(id: string): Promise<Comment> {
    return apiClient.get<Comment>(`/comments/${id}`)
  },

  /**
   * Create a new comment
   */
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response = await apiClient.post<CreateCommentResponse>('/comments', data)
    return response.comment
  },

  /**
   * Update a comment
   */
  async updateComment(id: string, data: UpdateCommentRequest): Promise<Comment> {
    const response = await apiClient.put<UpdateCommentResponse>(`/comments/${id}`, data)
    return response.comment
  },

  /**
   * Delete a comment
   */
  async deleteComment(id: string): Promise<void> {
    await apiClient.delete<DeleteCommentResponse>(`/comments/${id}`)
  },

  /**
   * Get replies to a comment
   */
  async getReplies(commentId: string, params?: Omit<GetCommentsParams, 'parentId'>): Promise<GetCommentsResponse> {
    return apiClient.get<GetCommentsResponse>('/comments', {
      params: { ...params, parentId: commentId },
    })
  },

  /**
   * Get comments by user
   */
  async getCommentsByUser(userId: string, params?: Omit<GetCommentsParams, 'postId'>): Promise<GetCommentsResponse> {
    return apiClient.get<GetCommentsResponse>(`/users/${userId}/comments`, { params })
  },
}
