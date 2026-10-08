import { useState, useEffect } from 'react';
import {
  Layers,
  Trophy,
  Calendar,
  Users,
  Settings as SettingsIcon,
  GraduationCap,
  RefreshCw,
  FileText,
  Megaphone,
  Camera,
  Wrench,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
} from 'lucide-react';
import type { TabId } from '../types';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  counts: {
    projects: number;
    banners: number;
    gallery: number;
    gear: number;
    events: number;
    achievements: number;
    members: number;
    alumni: number;
    applications: number;
  };
  loading: boolean;
  onSync: () => void;
  onLogout?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, counts, loading, onSync, onLogout }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabSelect = (tab: TabId) => {
    setActiveTab(tab);
    if (isMobile) setIsMobileOpen(false);
  };

  const navItems = [
    { id: 'settings' as TabId, label: 'Site Settings & Copy', icon: <SettingsIcon size={17} strokeWidth={2} />, count: undefined },
    { id: 'projects' as TabId, label: 'Flagship Projects', icon: <Layers size={17} strokeWidth={2} />, count: counts.projects },
    { id: 'gear' as TabId, label: 'Workshop & Gear', icon: <Wrench size={17} strokeWidth={2} />, count: counts.gear },
    { id: 'events' as TabId, label: 'Events & Hackathons', icon: <Calendar size={17} strokeWidth={2} />, count: counts.events },
    { id: 'achievements' as TabId, label: 'National Honors', icon: <Trophy size={17} strokeWidth={2} />, count: counts.achievements },
    { id: 'members' as TabId, label: 'Leadership & Team', icon: <Users size={17} strokeWidth={2} />, count: counts.members },
    { id: 'alumni' as TabId, label: 'Alumni Directory', icon: <GraduationCap size={17} strokeWidth={2} />, count: counts.alumni },
    { id: 'gallery' as TabId, label: 'Field Media & Gallery', icon: <Camera size={17} strokeWidth={2} />, count: counts.gallery },
    { id: 'banners' as TabId, label: 'Alert Banners', icon: <Megaphone size={17} strokeWidth={2} />, count: counts.banners },
    { id: 'applications' as TabId, label: 'Admissions & Inbox', icon: <FileText size={17} strokeWidth={2} />, count: counts.applications },
  ];

  const sidebarContent = (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Apple Brand Header Lockup */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'rgba(0, 113, 227, 0.12)',
                border: '1px solid rgba(0, 113, 227, 0.3)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                padding: '4px',
              }}
            >
              <img src="/traic-logo.png" alt="TRAIC Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', color: '#F5F5F7' }}>TRAIC Console</div>
              <div style={{ fontSize: '11px', color: '#86868B', letterSpacing: '0.02em' }}>
                Admin Portal
              </div>
            </div>
          </div>
          {isMobile && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#A1A1A6',
                cursor: 'pointer',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                minWidth: '44px',
              }}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Database Status Ribbon */}
        <div
          style={{
            backgroundColor: '#1D1D1F',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={13} style={{ color: '#30D158' }} />
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#F5F5F7' }}>Neon PostgreSQL</span>
          </div>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: '#30D158',
              backgroundColor: 'rgba(48, 209, 88, 0.12)',
              padding: '2px 7px',
              borderRadius: '980px',
            }}
          >
            Live Sync
          </span>
        </div>

        {/* Navigation Items (Apple Store Online Segmented List) */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#6E6E73',
              paddingLeft: '8px',
              paddingBottom: '4px',
            }}
          >
            Management Collections
          </div>
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabSelect(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  border: isActive ? '1px solid rgba(0, 113, 227, 0.4)' : '1px solid transparent',
                  backgroundColor: isActive ? 'rgba(0, 113, 227, 0.15)' : 'transparent',
                  color: isActive ? '#2997FF' : '#E5E5EA',
                  textAlign: 'left',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  width: '100%',
                  minHeight: '44px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <span style={{ color: isActive ? '#2997FF' : '#8E8E93', flexShrink: 0 }}>{tab.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '980px',
                      backgroundColor: isActive ? 'rgba(0, 113, 227, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#2997FF' : '#8E8E93',
                      flexShrink: 0,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sync & Footer Operations */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            width: '100%',
            borderRadius: '980px',
            backgroundColor: '#0071E3',
            color: '#FFFFFF',
            fontSize: '12.5px',
            fontWeight: 600,
            textDecoration: 'none',
            boxSizing: 'border-box',
            minHeight: '44px',
            transition: 'background-color 0.2s ease',
          }}
        >
          <ExternalLink size={14} />
          <span>Preview Live Website ↗</span>
        </a>

        <button
          type="button"
          onClick={onSync}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            width: '100%',
            borderRadius: '980px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: '#F5F5F7',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12.5px',
            fontWeight: 500,
            cursor: 'pointer',
            minHeight: '44px',
            transition: 'background-color 0.2s ease',
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>Sync Database & Cache</span>
        </button>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              width: '100%',
              borderRadius: '980px',
              backgroundColor: 'rgba(255, 69, 58, 0.1)',
              color: '#FF453A',
              border: '1px solid rgba(255, 69, 58, 0.25)',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '44px',
              transition: 'background-color 0.2s ease',
            }}
          >
            <LogOut size={14} />
            <span>Lock Console & Logout</span>
          </button>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Frosted Top Bar */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '56px',
            backgroundColor: 'rgba(29, 29, 31, 0.94)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 9999,
          }}
        >
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#F5F5F7',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '8px',
              minHeight: '44px',
              minWidth: '44px',
            }}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          <div style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em', color: '#F5F5F7' }}>TRAIC Console</div>
          <div style={{ width: '44px' }} />
        </div>

        {/* Drawer Backdrop Overlay */}
        {isMobileOpen && (
          <div
            onClick={() => setIsMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 10000,
            }}
          />
        )}

        {/* Mobile Slide-Out Drawer */}
        <aside
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            backgroundColor: '#1D1D1F',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 10001,
            transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
            overflowY: 'auto',
          }}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop Apple Store Online Sidebar
  return (
    <aside
      style={{
        width: '270px',
        minWidth: '270px',
        backgroundColor: '#161617',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '22px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
      }}
    >
      {sidebarContent}
    </aside>
  );
}
