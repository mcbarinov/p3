# TanStack Query Caching Example

## How Forum Caching Works

### Before (Manual Caching)

```typescript
// useForums.ts - Complex manual caching
const useForumStore = create((set) => ({
  forums: [],
  setForums: (forums) => set({ forums })
}))

function useLoadForums() {
  const [loading, setLoading] = useState(false)
  const forums = useForumStore(state => state.forums)

  useEffect(() => {
    // Manual check if data exists
    if (forums.length === 0 && !loading) {
      loadForums() // Manual API call
    }
  }, [forums.length, loading])
}

// Layout.tsx - Manual initialization
function Layout() {
  useLoadForums() // Force load on app start
  return <div>...</div>
}
```

### After (Automatic Caching)

```typescript
// ForumsPage.tsx - Simple and automatic
function ForumsPage() {
  const { data: forums, isPending } = useQuery({
    queryKey: ["forums"],           // Cache key
    queryFn: api.forum.getForums,   // Data fetcher
    staleTime: 5 * 60 * 1000,      // 5 minutes fresh
  })

  return <div>{/* render forums */}</div>
}

// Any other component can use the same data
function SomeOtherComponent() {
  const { data: forums } = useQuery({
    queryKey: ["forums"],   // Same key = same cached data!
    queryFn: api.forum.getForums,
  })
  // No duplicate network requests!
}
```

## Caching Benefits

### 1. **Automatic Deduplication**

```typescript
// Multiple components can request same data
<ForumsPage />        // Makes API call
<ForumSelector />     // Uses cached data
<ForumCounter />      // Uses cached data
```

### 2. **Smart Refetching**

- Window focus → Refetch stale data
- Network reconnect → Refetch failed queries
- Manual refetch → `refetch()` function

### 3. **Background Updates**

- Data stays fresh automatically
- User sees cached data immediately
- Updates happen in background

### 4. **No Manual State Management**

```typescript
// Before: Manual sync between API and store
const result = await api.forum.getForums()
if (result.isOk()) {
  setForums(result.value) // Manual store update
}

// After: Automatic caching
const { data } = useQuery({
  queryKey: ["forums"],
  queryFn: api.forum.getForums,
})
// TanStack Query handles everything!
```

## Cache Configuration

```typescript
// main.tsx - Global cache settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min fresh
      retry: 1, // Retry once on failure
      refetchOnWindowFocus: false, // Don't refetch on focus
    },
  },
})
```

## Result: Zero Configuration Caching 🚀

- ✅ Automatic cache management
- ✅ No duplicate network requests
- ✅ Background synchronization
- ✅ Optimistic updates support
- ✅ Error retry logic
- ✅ Loading states handled
