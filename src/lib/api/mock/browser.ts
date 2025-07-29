import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"

export const worker = setupWorker(...handlers)

// Log all handlers for debugging
console.log(
  "MSW handlers registered:",
  handlers.map((h) => `${h.info.method} ${h.info.path}`)
)
