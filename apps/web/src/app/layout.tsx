import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppleNavbar } from '@/components/AppleNavbar';
import { AppleFooter } from '@/components/AppleFooter';
import { MobileTabBar } from '@/components/MobileTabBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TRAIC — Technology, Robotics & AI Community | COER University',
  description: 'Collegiate engineering community mastering custom circuit boards, autonomous robotics, and self-hosted Linux infrastructure from the ground up at DIA Labs Block C-302.',
  keywords: ['Robotics', 'Embedded Systems', 'PCB Design', 'Artificial Intelligence', 'ROS2', 'DIA Labs', 'Self-Host', 'COER University'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head></head>
      <body className="min-h-screen bg-canvas text-ink-primary antialiased selection:bg-apple-blue selection:text-white">
        {/* WCAG 2.2 AA Mandatory Skip Link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <AppleNavbar />
        <main id="main-content" className="relative">
          {children}
        </main>
        <AppleFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
