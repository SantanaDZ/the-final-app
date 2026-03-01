import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GlobalNav } from '@/components/global-nav'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Equilibra | Gerencie Todas as Áreas da Sua Vida',
  description: 'O aplicativo que revoluciona a forma como você organiza tarefas, finanças e todas as áreas da vida. Simples, visual e inteligente.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <GlobalNav />
        <main className="flex-1">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
