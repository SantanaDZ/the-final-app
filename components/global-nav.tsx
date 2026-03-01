"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./navbar"

export function GlobalNav() {
    const pathname = usePathname()

    // Do not show the new top navbar on the application layout or auth pages
    if (
        pathname &&
        (pathname.startsWith("/app") || pathname.startsWith("/login") || pathname.startsWith("/cadastro"))
    ) {
        return null
    }

    return <Navbar />
}
