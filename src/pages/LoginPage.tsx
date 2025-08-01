import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/authStore"

const formSchema = z.object({
  username: z.string().min(1, { message: "Username must be between 1 and 100 characters" }),
  password: z.string().min(6, { message: "Password must be between 6 and 100 characters" }),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) => api.auth.login(credentials),
    onSuccess: (data, variables) => {
      login(data.sessionId, data.userId, variables.username)
      toast.success("Login successful")
      navigate("/")
    },
    onError: (error) => {
      toast.error("Login failed: " + error.message)
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(values)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Toaster position="top-center" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter your username" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-4" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
              {loginMutation.error && <div className="text-red-600 text-sm mt-2">{loginMutation.error.message}</div>}
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  )
}
