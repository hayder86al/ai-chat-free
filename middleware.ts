import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySession } from "./app/actions"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const protectedRoutes = ["/"]
  const currentRoute = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(currentRoute)
  if (isProtectedRoute) {
    const session = await verifySession()
    if (session?.userName) {
      return NextResponse.next()
    }
  }
  return NextResponse.redirect(new URL("/login", request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/"],
}
