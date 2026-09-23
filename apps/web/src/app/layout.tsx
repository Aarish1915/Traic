import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-0 text-text-1 antialiased selection:bg-accent selection:text-bg-0">
        {/* Top Announcement Bar */}
        <div className="relative z-50 border-b border-accent/20 bg-accent/10 px-4 py-2 text-center text-xs font-medium text-accent">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Applications for the 2025 Cohort are now live!</span>
            <Link
              href="/join"
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:text-white"
            >
              <span>Apply now</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <Navbar />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
