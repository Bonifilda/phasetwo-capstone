// Tags API functions

import { apiClient } from './client'
import {
  GetTagsParams,
  GetTagsResponse,
  GetPostsByTagParams,
  GetPostsByTagResponse,
  CreateTagRequest,
  CreateTagResponse,
} from '@/types/api'
import { Tag } from '@/types'

export const tagsApi = {
  /**
   * Get all tags with optional filters and pagination
   */
  async getTags(params?: GetTagsParams): Promise<GetTagsResponse> {
    return apiClient.get<GetTagsResponse>('/tags', { params })
  },

  /**
   * Get a single tag by ID
   */
  async getTagById(id: string): Promise<Tag> {
    return apiClient.get<Tag>(`/tags/by-id/${id}`)
  },

  /**
   * Get a single tag by name
   */
  async getTagByName(name: string): Promise<Tag> {
    return apiClient.get<Tag>(`/tags/name/${name}`)
  },

  /**
   * Create a new tag
   */
  async createTag(data: CreateTagRequest): Promise<Tag> {
    const response = await apiClient.post<CreateTagResponse>('/tags', data)
    return response.tag
  },

  /**
   * Get posts by tag
   */
  async getPostsByTag(params: GetPostsByTagParams): Promise<GetPostsByTagResponse> {
    const { tag, ...queryParams } = params
    return apiClient.get<GetPostsByTagResponse>(`/tags/${tag}/posts`, {
      params: queryParams,
    })
  },

  /**
   * Get popular tags
   */
  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    const response = await apiClient.get<{ tags: Tag[] }>('/tags/popular', {
      params: { limit },
    })
    return response.tags
  },

  /**
   * Search tags
   */
  async searchTags(query: string, limit: number = 10): Promise<Tag[]> {
    const response = await apiClient.get<{ tags: Tag[] }>('/tags/search', {
      params: { query, limit },
    })
    return response.tags
  },

  /**
   * Delete a tag (admin only)
   */
  async deleteTag(id: string): Promise<void> {
    await apiClient.delete(`/tags/${id}`)
  },
}
