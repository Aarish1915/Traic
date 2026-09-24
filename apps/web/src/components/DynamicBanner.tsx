'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, AlertTriangle, Trophy, Calendar, X } from 'lucide-react';
import type { Banner } from '@traic/shared';

const API_BASE = 'http://localhost:4000';

export function DynamicBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/public/banners`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // Pick the highest priority active banner
          setBanner(res.data[0]);
        }
      })
      .catch(() => {
        // Fallback default
        setBanner({
          title: 'Cohort 2025 Live',
          message: 'Applications for the 2025 Hardware & AI Engineering Cohort are now open!',
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
          bg: 'bg-danger/10 border-danger/30 text-danger',
          badge: 'bg-danger/20 text-danger',
          icon: <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 animate-bounce" />,
        };
      case 'ACHIEVEMENT':
        return {
          bg: 'bg-success/10 border-success/30 text-success',
          badge: 'bg-success/20 text-success',
          icon: <Trophy className="h-3.5 w-3.5 flex-shrink-0" />,
        };
      case 'EVENT':
        return {
          bg: 'bg-accent-2/10 border-accent-2/30 text-accent-2',
          badge: 'bg-accent-2/20 text-accent-2',
          icon: <Calendar className="h-3.5 w-3.5 flex-shrink-0" />,
        };
      default:
        return {
          bg: 'bg-accent/10 border-accent/20 text-accent',
          badge: 'bg-accent/20 text-accent',
          icon: <Sparkles className="h-3.5 w-3.5 flex-shrink-0 animate-pulse" />,
        };
    }
  };

  const style = getTypeStyle();

  return (
    <div
      className={`relative z-50 border-b px-4 py-2 text-center text-xs font-medium transition-all ${style.bg}`}
      role="alert"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2.5 flex-wrap">
          {style.icon}
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${style.badge}`}>
            {banner.type}
          </span>
          <span className="font-semibold text-text-1">{banner.message}</span>
          {banner.linkUrl && (
            <Link
              href={banner.linkUrl}
              className="inline-flex items-center gap-1 font-bold underline underline-offset-4 hover:text-white transition-colors"
            >
              <span>{banner.linkText || 'Learn more'}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="rounded p-1 text-text-2 hover:bg-surface hover:text-text-1 transition-colors"
          title="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
