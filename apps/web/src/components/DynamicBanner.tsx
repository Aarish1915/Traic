'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, AlertTriangle, Trophy, Calendar, X } from 'lucide-react';

export interface Banner {
  id?: string;
  title?: string;
  message: string;
  linkUrl?: string;
  linkText?: string;
  type: 'ANNOUNCEMENT' | 'URGENT' | 'ACHIEVEMENT' | 'EVENT';
  isActive: boolean;
  priority?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function DynamicBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/public/banners`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch banners');
        return res.json();
      })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setBanner(res.data[0]);
        }
      })
      .catch(() => {
        // Fallback default announcement
        setBanner({
          title: 'Cohort 2026 Live',
          message: 'Admissions for the 2026 Hardware, Embedded & AI Cohort are now open.',
          linkUrl: '/join',
          linkText: 'Apply Now',
          type: 'ANNOUNCEMENT',
          isActive: true,
          priority: 1,
        });
      });
  }, []);

  if (!banner || !banner.isActive || dismissed) {
    return null;
  }

  const getTypeStyle = () => {
    switch (banner.type) {
      case 'URGENT':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-500',
          badge: 'bg-red-500/20 text-red-500 border border-red-500/40',
          icon: <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 animate-bounce" />,
        };
      case 'ACHIEVEMENT':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-500/40',
          icon: <Trophy className="h-3.5 w-3.5 flex-shrink-0" />,
        };
      case 'EVENT':
        return {
          bg: 'bg-canvas-glass border-b border-subtle text-ink-primary',
          badge: 'bg-apple-blue/15 text-apple-blue border border-apple-blue/30',
          icon: <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-apple-blue" />,
        };
      default:
        return {
          bg: 'bg-canvas-glass border-b border-subtle text-ink-primary',
          badge: 'bg-apple-blue/15 text-apple-blue border border-apple-blue/30',
          icon: <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-apple-blue animate-pulse" />,
        };
    }
  };

  const style = getTypeStyle();

  return (
    <aside
      className={`w-full border-b backdrop-blur-md px-4 py-2 text-center text-xs font-medium transition-all pointer-events-auto ${style.bg}`}
      role="alert"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2.5 flex-wrap">
          {style.icon}
          <span className={`rounded-pill px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${style.badge}`}>
            {banner.type}
          </span>
          <span className="font-semibold text-ink-primary">{banner.message}</span>
          {banner.linkUrl && (
            <Link
              href={banner.linkUrl}
              className="inline-flex items-center gap-1 font-bold underline underline-offset-4 text-apple-blue hover:text-ink-primary transition-colors cursor-pointer min-h-[44px] min-w-[44px] px-1"
            >
              <span>{banner.linkText || 'Learn more'}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="rounded-full p-2 text-ink-secondary hover:bg-canvas-surface hover:text-ink-primary transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Dismiss announcement"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
