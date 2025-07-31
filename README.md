# P3 - React Architecture Demo

This is a demo project that serves as a reference architecture for React applications. This project will be referenced in other real projects as an architectural example.

## Project Description

The project implements a forum system where:

- Forums contain posts
- Posts contain comments

## Technology Stack

### Core

- **React** 19 - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool

### Routing & State

- **React Router** v7 - Client-side routing
- **Zustand** - State management with persistence

### UI & Styling

- **Tailwind CSS** v4 - Utility-first CSS
- **Radix UI** - Headless UI components
- **Lucide React** - Icons

### Forms & Validation

- **React Hook Form** - Form handling
- **Zod** - Schema validation

### API & Networking

- **Ky** - HTTP client
- **MSW** - API mocking for development
- **neverthrow** - Error handling

### Development

- **ESLint** - Linting
- **Prettier** - Code formatting

## Architecture Decisions

### Core Principles

- **Simplicity First**: All implementations prioritize simplicity over premature optimization
- **Developer Experience**: APIs are designed to be intuitive and require minimal boilerplate
- **Consistency**: Similar patterns are used across all layers for predictability

### Hook-Based Architecture

The application follows a modern hook-based architecture pattern:

#### 1. Stores (State Management)

- **Principle**: Minimal and pure state containers
- **Rules**:
  - No API calls or external dependencies
  - No side effects (navigation, toasts, etc.)
  - Only state and simple state update methods
- **Example**: `authStore` only manages auth state with `login()` and `logout()` methods

#### 2. HTTP API Layer

- **Principle**: Minimal HTTP abstraction with simplified interface
- **Rules**:
  - No store access or state management
  - No side effects
  - Returns `Result<T, E>` for explicit error handling
  - Clean interfaces for request/response types
  - Uses unified `apiClient` wrapper for DRY code
- **Example**: `api.auth.login()` returns `Result<LoginResponse, ApiError>`
- **Implementation**: All API methods use `apiClient.get/post/put/patch/delete<T>()` for consistency
- **Access Pattern**: `import { api } from "@/lib/api"` → `api.auth.login()`, `api.forum.getForums()`

**Architectural Exception**: The base API client (`api/index.ts`) accesses `authStore` to automatically attach session headers to all requests. This is an intentional violation for developer convenience, eliminating the need to manually pass sessionId to every authenticated API call.

#### 3. Hooks (Business Logic & React Integration)

- **Principle**: Custom React hooks that combine data, actions, and state management
- **Rules**:
  - Combines stores, APIs, and React state in a single hook
  - Handles all side effects (navigation, toasts, etc.)
  - Provides auto-loading functionality - no manual useEffect needed
  - Returns unified interface: `{ data, loading, error, actions }`
  - **Colocation**: Hooks are defined where they're used - only shared hooks go in `/hooks`
  - Component-specific hooks are defined in the component file itself
- **Example**: `useAuth()` provides login/logout actions + user data + loading states with auto-loading
- **Access Patterns**:
  - Shared hooks: `import { useAuth } from "@/hooks"`
  - Local hooks: Defined directly in component file

**Hook Examples:**

```typescript
// Authentication with auto-loading user data
import { useAuth } from "@/hooks"

function LoginPage() {
  const { login, loading, error } = useAuth()

  const handleSubmit = async (username, password) => {
    await login(username, password) // handles API, store, navigation, toasts
  }
}

function Header() {
  const { username, logout } = useAuth() // gets data + actions from one source
}

// Shared hook - Forums data with auto-loading
import { useForums } from "@/hooks"

function ForumsPage() {
  const { forums, loading, error } = useForums() // auto-loads on mount
  // No manual useEffect needed!
}

// Local hook - defined in the component file
function usePosts(forumId: number) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // fetch posts logic
  }, [forumId])

  return { posts, loading }
}

function ForumPostsPage() {
  const { posts, loading } = usePosts(Number(forumId)) // local hook
}
```

**Colocation Principle:**

- **Local hooks**: Component-specific hooks are defined in the component file
- **Shared hooks**: Only hooks used in multiple components go in `/hooks` directory
- **Benefits**: Easier to understand, modify, and maintain when logic is close to usage

**Key Benefits:**

- **Auto-loading**: Data loads automatically, no manual useEffect required
- **Unified Interface**: Get data + actions + loading/error states from one hook
- **React Integration**: Built-in React lifecycle and state management
- **Simplicity**: Fewer abstractions than service layer approach
- **Colocation**: Related code stays together, improving maintainability

### Project Structure

```
src/
├── hooks/                     # Shared React hooks (used in multiple components)
│   ├── useAuth.ts            # Authentication hook (used in LoginPage, Header, etc.)
│   ├── useForums.ts          # Forums data hook (used in ForumsPage, ForumPostsPage)
│   └── index.ts              # Unified hooks export
├── stores/                   # Zustand state stores
│   ├── authStore.ts          # Authentication state
│   └── forumStore.ts         # Forum data state
├── lib/api/                  # HTTP API layer
│   ├── auth.ts               # Auth API endpoints
│   ├── forum.ts              # Forum API endpoints
│   └── index.ts              # Unified API client
├── components/               # React components
│   ├── ui/                   # Reusable UI primitives
│   ├── layout/               # Layout components
│   └── shared/               # Business components
└── pages/                    # Page components
    ├── LoginPage.tsx         # Simple page
    └── ForumPostsPage.tsx    # Contains usePosts hook (local to this component)
```

### Component Organization

Components are organized using a **file-or-folder strategy** based on complexity:

```
src/
├── components/
│   ├── ui/                    # Global UI components (Button, Card, Input)
│   ├── layout/                # Layout components (Header, Footer, Layout)
│   └── shared/                # Reusable business components (used across pages)
├── pages/
│   ├── DashboardPage/
│   │   ├── DashboardPage.tsx    # Main component (same name as folder)
│   │   ├── UserStats.tsx        # Page-specific components
│   │   └── SalesChart.tsx
│   └── LoginPage.tsx            # Simple pages as files
```

#### Organization Rules

1. **Simple Pages (File Structure)**:
   - Use single `.tsx` file for simple pages
   - No page-specific components needed
   - Example: `LoginPage.tsx`, `IndexPage.tsx`

2. **Complex Pages (Folder Structure)**:
   - Use folder when page becomes complex or needs page-specific components
   - Main component file has same name as folder (no `index.tsx`)
   - Page-specific components live alongside main component
   - All folders and main files should have `Page` suffix
   - Example: `DashboardPage/DashboardPage.tsx`

3. **Component Categories**:
   - **`components/ui/`**: Reusable UI primitives (Button, Card, Input)
   - **`components/layout/`**: Application layout components
   - **`components/shared/`**: Business components used across multiple pages
   - **`pages/PageNamePage/`**: Components used only within specific page

#### Benefits

- **Editor Navigation**: No multiple `index.tsx` files, easy file identification
- **Clear Boundaries**: Obvious separation between reusable and page-specific components
- **Scalability**: Simple pages stay simple, complex pages can grow organically
- **Predictable Structure**: Consistent naming and organization patterns

## Architecture Benefits

- **Simplicity**: Minimal boilerplate, intuitive hook APIs, easy to understand
- **Developer Experience**: Single import for hooks, auto-loading data, unified interface for data + actions
- **Modern React**: Uses standard React patterns that developers already know
- **No Manual Effects**: Auto-loading eliminates need for manual useEffect in components
- **Testability**: Hooks can be tested in isolation using React Testing Library
- **Maintainability**: Clear separation between UI (components) and logic (hooks)
- **Predictability**: Data flow is unidirectional and explicit through hooks
- **Type Safety**: Full TypeScript support with Result types for error handling
