import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'MioSalon - Salon Management Software',
  description: 'Complete salon and spa management platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-16 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-slate-50">
              {children}
            </main>
          </div>
        </div>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
