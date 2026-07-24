import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  
  // Public routes - don't protect these
  const isPublicRoute = pathname === '/' || pathname.startsWith('/track')
  const isAuthPage = pathname.startsWith('/login')
  const isApiRoute = pathname.startsWith('/api')

  // Allow public routes and API routes
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next()
  }

  // If on login page and already logged in, redirect to dashboard
  if (isAuthPage) {
    if (isLoggedIn) {
      const role = req.auth?.user?.role as string | undefined
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.nextUrl))
      }
      return NextResponse.redirect(new URL('/technician', req.nextUrl))
    }
    return NextResponse.next()
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    let from = pathname
    if (req.nextUrl.search) {
      from += req.nextUrl.search
    }
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl)
    )
  }

  const role = req.auth?.user?.role as string | undefined

  // Admin routes require ADMIN role
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/technician', req.nextUrl))
  }

  // Technician routes require TECHNICIAN or ADMIN role
  if (pathname.startsWith('/technician') && role !== 'TECHNICIAN' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
