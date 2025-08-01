import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "./api"
import type { Forum } from "@/types"

// Permanent cache configuration for forums
const FORUMS_QUERY_CONFIG = {
  staleTime: Infinity,        // Never consider stale
  gcTime: Infinity,           // Never garbage collect  
  refetchOnWindowFocus: false, // Don't refetch on focus
  refetchOnReconnect: false,   // Don't refetch on reconnect
}

// Hook to get all forums with permanent caching
export function useForums() {
  return useQuery({
    queryKey: ["forums"],
    queryFn: api.forum.getForums,
    ...FORUMS_QUERY_CONFIG,
  })
}

// Hook to get specific forum by ID from cache (no API call)
export function useForumById(forumId: number): Forum | undefined {
  const queryClient = useQueryClient()
  
  // Get forums from cache (no API call)
  const forums = queryClient.getQueryData<Forum[]>(["forums"])
  
  return forums?.find(forum => forum.id === forumId)
}

// Hook for manual refresh (for future refresh button)
export function useRefreshForums() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ["forums"] })
  }
}