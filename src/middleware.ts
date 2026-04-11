import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Only protect /admin routes (but not the login page itself)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    const expected = process.env.ADMIN_TOKEN;

    if (!expected || token !== expected) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Capture rep referral param
  const ref = searchParams.get('ref');
  if (ref && /^[a-zA-Z0-9]{10,40}$/.test(ref)) {
    const response = NextResponse.next();
    response.cookies.set('rep_ref', ref, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/rep/:path*', '/', '/contact', '/services', '/work', '/about'],
};
