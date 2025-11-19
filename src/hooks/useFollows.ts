import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { followsApi } from '@/lib/api'
import { GetFollowersParams, GetFollowingParams } from '@/types/api'
import { User } from '@/types'

// Query keys for consistent caching
export const followKeys = {
  all: ['follows'] as const,
  followers: (userId: string) => [...followKeys.all, 'followers', userId] as const,
  following: (userId: string) => [...followKeys.all, 'following', userId] as const,
  status: (userId: string) => [...followKeys.all, 'status', userId] as const,
  currentFollowers: () => [...followKeys.all, 'current', 'followers'] as const,
  currentFollowing: () => [...followKeys.all, 'current', 'following'] as const,
  suggested: () => [...followKeys.all, 'suggested'] as const,
}

// Get followers of a user
export function useFollowers(params: GetFollowersParams) {
  return useQuery({
    queryKey: followKeys.followers(params.userId),
    queryFn: () => followsApi.getFollowers(params),
    enabled: !!params.userId,
  })
}

// Get users that a user is following
export function useFollowing(params: GetFollowingParams) {
  return useQuery({
    queryKey: followKeys.following(params.userId),
    queryFn: () => followsApi.getFollowing(params),
    enabled: !!params.userId,
  })
}

// Check if current user is following a specific user
export function useFollowStatus(userId: string) {
  return useQuery({
    queryKey: followKeys.status(userId),
    queryFn: () => followsApi.checkFollowStatus(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Get current user's followers
export function useCurrentUserFollowers(params?: Omit<GetFollowersParams, 'userId'>) {
  return useQuery({
    queryKey: followKeys.currentFollowers(),
    queryFn: () => followsApi.getCurrentUserFollowers(params),
  })
}

// Get users that current user is following
export function useCurrentUserFollowing(params?: Omit<GetFollowingParams, 'userId'>) {
  return useQuery({
    queryKey: followKeys.currentFollowing(),
    queryFn: () => followsApi.getCurrentUserFollowing(params),
  })
}

// Get suggested users to follow
export function useSuggestedUsers(limit: number = 5) {
  return useQuery({
    queryKey: followKeys.suggested(),
    queryFn: () => followsApi.getSuggestedUsers(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Follow user mutation
export function useFollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => followsApi.followUser({ userId }),
    onSuccess: (_, userId) => {
      // Update follow status
      queryClient.setQueryData(followKeys.status(userId), true)

      // Invalidate followers/following lists
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId) })
      queryClient.invalidateQueries({ queryKey: followKeys.currentFollowing() })
    },
  })
}

// Unfollow user mutation
export function useUnfollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => followsApi.unfollowUser({ userId }),
    onSuccess: (_, userId) => {
      // Update follow status
      queryClient.setQueryData(followKeys.status(userId), false)

      // Invalidate followers/following lists
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId) })
      queryClient.invalidateQueries({ queryKey: followKeys.currentFollowing() })
    },
  })
}

// Toggle follow mutation (optimistic updates)
export function useToggleFollow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => followsApi.toggleFollow(userId),
    onMutate: async (userId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: followKeys.status(userId) })

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(followKeys.status(userId))

      // Optimistically update to the opposite value
      const newStatus = !previousStatus
      queryClient.setQueryData(followKeys.status(userId), newStatus)

      // Return a context object with the snapshotted value
      return { previousStatus, userId }
    },
    onError: (err, userId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(followKeys.status(userId), context.previousStatus)
      }
    },
    onSettled: (data, error, userId) => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: followKeys.status(userId) })
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId) })
      queryClient.invalidateQueries({ queryKey: followKeys.currentFollowing() })
    },
  })
}
