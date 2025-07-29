import { createBrowserRouter, redirect } from "react-router"
import LoginPage from "./components/pages/LoginPage"
import Layout from "./components/layout/Layout"
import IndexPage from "./components/pages/IndexPage"
import { useAuthStore } from "./stores/authStore"
import { Data1Page } from "./components/pages/Data1Page"

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
      { path: "data1", Component: Data1Page },
    ],
  },
])
