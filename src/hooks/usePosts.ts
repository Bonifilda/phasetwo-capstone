import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '@/lib/api'
import { GetPostsParams, CreatePostRequest, UpdatePostRequest } from '@/types/api'
import { Post } from '@/types'

// Query keys for consistent caching
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: GetPostsParams) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  feed: (type: string) => [...postKeys.all, 'feed', type] as const,
  drafts: () => [...postKeys.all, 'drafts'] as const,
  search: (query: string) => [...postKeys.all, 'search', query] as const,
}

// Get posts with optional filters
export function usePosts(params?: GetPostsParams) {
  return useQuery({
    queryKey: postKeys.list(params || {}),
    queryFn: () => postsApi.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single post by ID
export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get post by slug (for SSG)
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: () => postsApi.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get posts by author
export function usePostsByAuthor(authorId: string, params?: Omit<GetPostsParams, 'authorId'>) {
  return useQuery({
    queryKey: postKeys.list({ ...params, authorId }),
    queryFn: () => postsApi.getPostsByAuthor(authorId, params),
    enabled: !!authorId,
  })
}

// Get posts by tag
export function usePostsByTag(tag: string, params?: Omit<GetPostsParams, 'tag'>) {
  return useQuery({
    queryKey: postKeys.list({ ...params, tag }),
    queryFn: () => postsApi.getPostsByTag(tag, params),
    enabled: !!tag,
  })
}

// Get feed posts
export function useFeed(type: 'latest' | 'following' | 'recommended' = 'latest', params?: GetPostsParams) {
  return useQuery({
    queryKey: postKeys.feed(type),
    queryFn: () => postsApi.getFeed(type, params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get user's drafts
export function useDrafts(params?: Omit<GetPostsParams, 'published'>) {
  return useQuery({
    queryKey: postKeys.drafts(),
    queryFn: () => postsApi.getDrafts(params),
  })
}

// Search posts
export function useSearchPosts(query: string, params?: Omit<GetPostsParams, 'search'>) {
  return useQuery({
    queryKey: postKeys.search(query),
    queryFn: () => postsApi.searchPosts(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Create post mutation
export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
    onSuccess: (newPost) => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })

      // Add the new post to cache
      queryClient.setQueryData(postKeys.detail(newPost.id), newPost)

      // If it's a draft, also invalidate drafts
      if (!newPost.published) {
        queryClient.invalidateQueries({ queryKey: postKeys.drafts() })
      }
    },
  })
}

// Update post mutation
export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostRequest }) =>
      postsApi.updatePost(id, data),
    onSuccess: (updatedPost) => {
      // Update the post in cache
      queryClient.setQueryData(postKeys.detail(updatedPost.id), updatedPost)

      // Invalidate lists that might contain this post
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })

      // If published status changed, invalidate appropriate lists
      if (updatedPost.published) {
        queryClient.invalidateQueries({ queryKey: postKeys.drafts() })
      }
    },
  })
}

// Delete post mutation
export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: postKeys.detail(deletedId) })

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.drafts() })
    },
  })
}

// Publish post mutation
export function usePublishPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postsApi.publishPost(id),
    onSuccess: (publishedPost) => {
      // Update the post in cache
      queryClient.setQueryData(postKeys.detail(publishedPost.id), publishedPost)

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.drafts() })
    },
  })
}

// Unpublish post mutation
export function useUnpublishPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postsApi.unpublishPost(id),
    onSuccess: (unpublishedPost) => {
      // Update the post in cache
      queryClient.setQueryData(postKeys.detail(unpublishedPost.id), unpublishedPost)

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.drafts() })
    },
  })
}
