import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    try {
        let supabaseResponse = NextResponse.next({
            request,
        })

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Supabase middleware: Missing environment variables.')
            return supabaseResponse // Fallback, let the page load or crash on the client
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const {
            data: { user },
        } = await supabase.auth.getUser()

        // Protect all /app, /financas, /chat routes
        const isProtectedRoute = request.nextUrl.pathname.startsWith('/app') ||
            request.nextUrl.pathname.startsWith('/financas') ||
            request.nextUrl.pathname.startsWith('/transactions') ||
            request.nextUrl.pathname.startsWith('/institutions') ||
            request.nextUrl.pathname.startsWith('/chat')

        if (!user && isProtectedRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Redirect authenticated user away from auth pages
        const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/cadastro'
        if (user && isAuthRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/app'
            return NextResponse.redirect(url)
        }

        return supabaseResponse
    } catch (e) {
        // If you are here, a Supabase client could not be created!
        // This is likely because environment variables are missing.
        console.error('Middleware Error:', e)
        return NextResponse.redirect(new URL('/login', request.url))
    }
}
