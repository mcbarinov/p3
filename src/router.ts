import { createBrowserRouter, redirect } from "react-router"
import LoginPage from "./pages/LoginPage"
import Layout from "./components/layout/Layout"
import IndexPage from "./pages/IndexPage"
import ForumsPage from "./pages/ForumsPage"
import ForumDetailPage from "./pages/ForumDetailPage"
import { useAuthStore } from "./stores/authStore"

function requireAuth() {
  const isAuthenticated = useAuthStore.getState().isAuthenticated
  if (!isAuthenticated) {
    throw redirect("/login")
  }
  return null
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: Layout,
    loader: requireAuth,
    children: [
      { index: true, Component: IndexPage },
      { path: "forums", Component: ForumsPage },
      { path: "forums/:forumId", Component: ForumDetailPage },
    ],
  },
])
