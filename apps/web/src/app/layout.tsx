import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DynamicBanner } from '@/components/DynamicBanner';
import { AnimeScrollObserver } from '@/components/AnimeScrollObserver';

export const metadata: Metadata = {
  title: 'TRAIC — Technology, Robotics & AI Community',
  description: 'Premier college engineering community dedicated to robotics, embedded systems, artificial intelligence, and software engineering. We build, learn, and compete.',
  keywords: ['Robotics', 'Embedded Systems', 'PCB Design', 'Artificial Intelligence', 'ROS2', 'Hackathons', 'Engineering Club'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('traic_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                document.documentElement.classList.remove('dark', 'light');
                document.documentElement.classList.add(theme);
                document.documentElement.setAttribute('data-theme', theme);
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg-0 text-text-1 antialiased selection:bg-accent selection:text-bg-0">
        <DynamicBanner />
        <Navbar />
        <main className="relative">{children}</main>
        <Footer />
        <AnimeScrollObserver />
      </body>
    </html>
  );
}
