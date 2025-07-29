import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { worker } from "./lib/api/mock/browser.ts"

async function prepare() {
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: "warn",
    })
    console.log("MSW started successfully")
  }
}

prepare().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
