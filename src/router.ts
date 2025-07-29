import { createBrowserRouter } from "react-router"
import LoginPage from "./components/pages/LoginPage"
import Layout from "./components/layout/Layout"
import IndexPage from "./components/pages/IndexPage"

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  { path: "/", Component: Layout, children: [{ index: true, Component: IndexPage }] },
])
