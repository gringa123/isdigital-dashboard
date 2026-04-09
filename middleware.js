import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('isdigital_auth')?.value
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    if (token === process.env.AUTH_SECRET) return NextResponse.redirect(new URL('/dashboard',request.url))
    return NextResponse.next()
  }
  if (pathname === '/') {
    if (token === process.env.AUTH_SECRET) return NextResponse.redirect(new URL('/dashboard',request.url))
    return NextResponse.redirect(new URL('/login',request.url))
  }
  if (token !== process.env.AUTH_SECRET) return NextResponse.redirect(new URL('/login',request.url))
  return NextResponse.next()
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
