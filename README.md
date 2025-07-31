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

- **Principle**: Minimal HTTP abstraction
- **Rules**:
  - No store access or state management
  - No side effects
  - Returns `Result<T, E>` for explicit error handling
  - Clean interfaces for request/response types
- **Example**: `authApi.login()` returns `Result<LoginResponse, ApiError>`

**Architectural Exception**: The base API client (`api/index.ts`) accesses `authStore` to automatically attach session headers to all requests. This is an intentional violation for developer convenience, eliminating the need to manually pass sessionId to every authenticated API call.

#### 3. Services (Business Logic)

- **Principle**: Orchestration and side effects
- **Rules**:
  - Combines stores, APIs, and other services
  - Handles all side effects (navigation, toasts, etc.)
  - Contains business logic and workflows
  - Used directly by React components
- **Example**: `authService.login()` calls API, updates store, shows toast, and navigates

### Benefits

- **Testability**: Each layer can be tested in isolation
- **Maintainability**: Clear separation of concerns
- **Predictability**: Data flow is unidirectional and explicit
- **Type Safety**: Full TypeScript support with Result types for error handling
