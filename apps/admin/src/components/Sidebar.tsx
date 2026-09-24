import { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Trophy,
  Calendar,
  Users,
  Settings as SettingsIcon,
  GraduationCap,
  RefreshCw,
  FileText,
  Megaphone,
  Box,
  Camera,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import type { TabId } from '../types';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  counts: {
    projects: number;
    models3d: number;
    banners: number;
    gallery: number;
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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when tab is selected on mobile
  const handleTabSelect = (tab: TabId) => {
    setActiveTab(tab);
    if (isMobile) setIsMobileOpen(false);
  };

  const navItems = [
    { id: 'projects' as TabId, label: 'Projects & Hardware', icon: <Layers size={18} />, count: counts.projects },
    { id: '3d-models' as TabId, label: 'Add Your 3D & Models', icon: <Box size={18} />, count: counts.models3d },
    { id: 'banners' as TabId, label: 'Banners & Alert Bar', icon: <Megaphone size={18} />, count: counts.banners },
    { id: 'gallery' as TabId, label: 'Field Gallery & Media', icon: <Camera size={18} />, count: counts.gallery },
    { id: 'events' as TabId, label: 'Events & Hackathons', icon: <Calendar size={18} />, count: counts.events },
    { id: 'achievements' as TabId, label: 'Achievements', icon: <Trophy size={18} />, count: counts.achievements },
    { id: 'members' as TabId, label: 'Leadership & Team', icon: <Users size={18} />, count: counts.members },
    { id: 'alumni' as TabId, label: 'Alumni Directory', icon: <GraduationCap size={18} />, count: counts.alumni },
    { id: 'settings' as TabId, label: 'Site Controls', icon: <SettingsIcon size={18} /> },
    { id: 'applications' as TabId, label: 'Applications', icon: <FileText size={18} />, count: counts.applications },
  ];

  const sidebarContent = (
    <>
      <div>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #232838' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'rgba(255, 159, 28, 0.15)',
                border: '1px solid rgba(255, 159, 28, 0.4)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF9F1C',
                flexShrink: 0,
              }}
            >
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '0.5px' }}>TRAIC STUDIO</div>
              <div style={{ fontSize: '10px', color: '#9AA3B5', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Coordinator Console
              </div>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              style={{ background: 'none', border: 'none', color: '#9AA3B5', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: activeTab === tab.id ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                backgroundColor: activeTab === tab.id ? '#141821' : 'transparent',
                color: activeTab === tab.id ? '#38BDF8' : '#9AA3B5',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span style={{ flexShrink: 0 }}>{tab.icon}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tab.label}</span>
              </div>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    backgroundColor: activeTab === tab.id ? '#07080B' : '#141821',
                    color: activeTab === tab.id ? '#38BDF8' : '#9AA3B5',
                    border: '1px solid #232838',
                    flexShrink: 0,
                    marginLeft: '6px',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Sync & Footer */}
      <div style={{ borderTop: '1px solid #232838', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a
          href={(import.meta as any).env?.VITE_PUBLIC_WEB_URL || 'https://traic.onrender.com'}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            width: '100%',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 159, 28, 0.1)',
            color: '#FF9F1C',
            border: '1px solid rgba(255, 159, 28, 0.35)',
            fontSize: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            boxSizing: 'border-box',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 159, 28, 0.2)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 159, 28, 0.1)')}
        >
          <ExternalLink size={14} />
          <span>View Public Website ↗</span>
        </a>

        <button
          onClick={onSync}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            width: '100%',
            borderRadius: '8px',
            backgroundColor: '#141821',
            color: '#38BDF8',
            border: '1px solid #232838',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>Sync Live API Data</span>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              width: '100%',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#F87171',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
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
        {/* Mobile top bar */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '56px',
            backgroundColor: '#0D0F14',
            borderBottom: '1px solid #232838',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => setIsMobileOpen(true)}
            style={{ background: 'none', border: 'none', color: '#E8EAF0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Menu size={22} />
          </button>
          <div style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '0.5px', color: '#E8EAF0' }}>TRAIC STUDIO</div>
          <div style={{ width: '38px' }} />
        </div>

        {/* Overlay */}
        {isMobileOpen && (
          <div
            onClick={() => setIsMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.65)',
              zIndex: 10000,
            }}
          />
        )}

        {/* Drawer */}
        <aside
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            backgroundColor: '#0D0F14',
            borderRight: '1px solid #232838',
            padding: '20px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 10001,
            transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
            overflowY: 'auto',
          }}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        backgroundColor: '#0D0F14',
        borderRight: '1px solid #232838',
        padding: '24px 14px',
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
