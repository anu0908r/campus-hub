'use client';

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { Header } from '@/components/header';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthGuard } from '@/components/auth-guard';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/signup'].includes(pathname);

  const metadata: Metadata = {
    title: 'Campus Hub',
    description: 'A responsive Education Portal providing seamless access to academic resources.',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')}>
        <FirebaseClientProvider>
          {isAuthPage ? (
            <main>{children}</main>
          ) : (
            <AuthGuard>
              <SidebarProvider>
                <MainSidebar />
                <SidebarInset>
                  <Header />
                  <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </AuthGuard>
          )}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
