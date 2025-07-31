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

### Three-Layer Architecture

The application follows a strict three-layer architecture pattern:

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

#### 3. Services (Business Logic)

- **Principle**: Orchestration and side effects with simplified interface
- **Rules**:
  - Combines stores, APIs, and other services
  - Handles all side effects (navigation, toasts, etc.)
  - Contains business logic and workflows
  - Returns `Promise<void>` - no Result handling needed in components
  - All error handling (toasts, redirects) happens internally
  - Used directly by React components via unified `services` export
- **Example**: `services.auth.login()` calls API, updates store, shows toast, and navigates
- **Access Pattern**: `import { services } from "@/services"` → `services.auth.login()`

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

- **Simplicity**: Minimal boilerplate, intuitive APIs, easy to understand
- **Developer Experience**: Single import for services, no Result handling in components
- **Testability**: Each layer can be tested in isolation
- **Maintainability**: Clear separation of concerns with consistent patterns
- **Predictability**: Data flow is unidirectional and explicit
- **Type Safety**: Full TypeScript support with Result types for error handling
