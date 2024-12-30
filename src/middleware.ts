import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// TODO: admin rote fixing 
interface Session {
    user?: {
        role?: string;
    };
}
export const middleware = async (req: NextRequest) => {
    try {
        // Get the session from the request using next-auth
        const session = await getToken({ req }) as Session | null;

        // Extract the token from cookies
        const token = cookies(req).get('__Secure-next-auth.session-token');

        // Get the pathname from the request URL
        const pathName = req.nextUrl.pathname;

        // Allow API routes to bypass authentication
        if (pathName.includes('api')) {
            return NextResponse.next();
        }

        // Redirect unauthenticated users to the login page with a redirect query parameter
        if (!token) {
            return NextResponse.redirect(new URL(`/login?redirect=${pathName}`, req.url));
        }

        // Check if the route is an admin route and validate if the user is an admin
        const isAdmin = session?.user?.role === 'admin';
        if (pathName.startsWith('/admin') && (!token || !isAdmin)) {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
        // Proceed to the requested route
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        // Redirect to an error page or handle the error gracefully
        return NextResponse.redirect(new URL('/error', req.url));
    }
};

export const config = {
    matcher: [
        // '/admin-dashboard/:path*' // only for admin
        // '/cart'
    ]
}