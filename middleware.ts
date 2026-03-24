import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // We need to use @supabase/ssr or just a basic check if standard client
  // Since we installed @supabase/supabase-js, we can do a cookie based check,
  // but for simplicity without ssr package yet:
  const authCookie = request.cookies.get('sb-access-token');
  const devCookie = request.cookies.get('dev-session');

  const { pathname } = request.nextUrl;
  
  // Allow bypass if dev-session cookie is present
  if (!authCookie && !devCookie && pathname !== '/' && !pathname.startsWith('/login') && !pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
