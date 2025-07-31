import { Outlet } from "react-router"
import Footer from "./Footer"
import Header from "./Header"
import { Toaster } from "@/components/ui/sonner"
import { useLoadForums } from "@/hooks"

export default function Layout() {
  // Initialize forums data when app starts
  useLoadForums()
  return (
    <div className="min-h-screen flex flex-col 	max-w-screen-xl mx-auto">
      <Toaster position="top-center" />
      <Header />
      <main className="flex-1 p-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
