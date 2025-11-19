import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { likesApi } from '@/lib/api'
import { GetPostLikesParams } from '@/types/api'
import { Like } from '@/types'

// Lightweight hook for a single post's like state
export function useLikes(postId: string) {
  const queryClient = useQueryClient()

  const { data: statusData } = useQuery({
    queryKey: ['post-like-status', postId],
    queryFn: () => likesApi.checkLikeStatus(postId),
    enabled: !!postId,
  })

  const { data: likesList } = useQuery({
    queryKey: ['post-likes', postId],
    queryFn: () => likesApi.getPostLikes({ postId, page: 1, limit: 1 }),
    enabled: !!postId,
  })

  const toggleLike = useMutation({
    mutationFn: () => likesApi.toggleLike(postId),
    onSuccess: (result) => {
      queryClient.setQueryData(['post-like-status', postId], result.isLiked)
      queryClient.setQueryData(['post-likes', postId], {
        ...(likesList ?? { data: [], pagination: { total: 0 } }),
        pagination: {
          ...(likesList?.pagination ?? { page: 1, limit: 1, totalPages: 1, hasMore: false }),
          total: result.likesCount,
        },
      })
    },
  })

  return {
    data: {
      isLiked: statusData ?? false,
      likesCount: likesList?.pagination.total ?? 0,
    },
    toggleLike,
    isLiking: toggleLike.isPending,
  }
}

// Query keys for consistent caching
export const likeKeys = {
  all: ['likes'] as const,
  lists: () => [...likeKeys.all, 'list'] as const,
  list: (filters: GetPostLikesParams) => [...likeKeys.lists(), filters] as const,
  status: (postId: string) => [...likeKeys.all, 'status', postId] as const,
  userLikes: (userId: string) => [...likeKeys.all, 'user', userId] as const,
  currentUserLikes: () => [...likeKeys.all, 'currentUser'] as const,
}

// Get likes for a post
export function usePostLikes(params: GetPostLikesParams) {
  return useQuery({
    queryKey: likeKeys.list(params),
    queryFn: () => likesApi.getPostLikes(params),
    enabled: !!params.postId,
  })
}

// Check if current user has liked a post
export function useLikeStatus(postId: string) {
  return useQuery({
    queryKey: likeKeys.status(postId),
    queryFn: () => likesApi.checkLikeStatus(postId),
    enabled: !!postId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Get user's liked posts
export function useUserLikedPosts(userId: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: likeKeys.userLikes(userId),
    queryFn: () => likesApi.getUserLikedPosts(userId, params),
    enabled: !!userId,
  })
}

// Get current user's liked posts
export function useCurrentUserLikedPosts(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: likeKeys.currentUserLikes(),
    queryFn: () => likesApi.getCurrentUserLikedPosts(params),
  })
}

// Like post mutation
export function useLikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => likesApi.likePost({ postId }),
    onSuccess: (result, postId) => {
      // Update like status for this post
      queryClient.setQueryData(likeKeys.status(postId), true)

      // Invalidate post likes list
      queryClient.invalidateQueries({
        queryKey: likeKeys.list({ postId }),
      })

      // Could also update post's like count if we had that in cache
      // This would require updating the post cache with new like count
    },
  })
}

// Unlike post mutation
export function useUnlikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => likesApi.unlikePost({ postId }),
    onSuccess: (_, postId) => {
      // Update like status for this post
      queryClient.setQueryData(likeKeys.status(postId), false)

      // Invalidate post likes list
      queryClient.invalidateQueries({
        queryKey: likeKeys.list({ postId }),
      })
    },
  })
}

// Toggle like mutation (optimistic updates)
export function useToggleLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => likesApi.toggleLike(postId),
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: likeKeys.status(postId) })

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(likeKeys.status(postId))

      // Optimistically update to the opposite value
      const newStatus = !previousStatus
      queryClient.setQueryData(likeKeys.status(postId), newStatus)

      // Return a context object with the snapshotted value
      return { previousStatus, postId }
    },
    onError: (err, postId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(likeKeys.status(postId), context.previousStatus)
      }
    },
    onSettled: (data, error, postId) => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: likeKeys.status(postId) })
      queryClient.invalidateQueries({ queryKey: likeKeys.list({ postId }) })
    },
  })
}
