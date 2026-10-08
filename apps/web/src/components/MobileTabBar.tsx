'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconBox, IconGear, IconTrophy, IconUsers } from './SFSymbols';

export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: 'Home', icon: IconHome, active: pathname === '/' },
    { href: '/projects', label: 'Hardware', icon: IconBox, active: pathname.startsWith('/projects') },
    { href: '/gear', label: 'DIA Labs', icon: IconGear, active: pathname.startsWith('/gear') },
    { href: '/achievements', label: 'Honors', icon: IconTrophy, active: pathname.startsWith('/achievements') },
    { href: '/join', label: 'Apply', icon: IconUsers, active: pathname.startsWith('/join') },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-3 left-4 right-4 z-50 flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-[420px] h-[60px] rounded-pill apple-nav-glass flex items-center justify-around px-2 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? 'page' : undefined}
              className={`flex-1 h-full min-h-[44px] flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                tab.active ? 'text-apple-blue font-semibold' : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
