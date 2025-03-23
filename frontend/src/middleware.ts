import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import cookie from 'cookie';
import { parse } from 'cookie';

  
export function middleware(request: NextRequest) {
  
  const cookies = parse(request.headers.get('Cookie') || '');
  const token = cookies?.accessToken;
  // console.log("token", token);
 
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

  return NextResponse.next();
};
export const config = {
  matcher: [
    "/dashboard/:path*",
     "/deposit/:path*",
     "/withdraw/:path*",
     "/transactions/:path*",
     "/profile/:path*",
     
    ],
};