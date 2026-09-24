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
}

export function Sidebar({ activeTab, setActiveTab, counts, loading, onSync }: SidebarProps) {
  const navItems = [
    { id: 'projects' as TabId, label: 'Projects & Hardware', icon: <Layers size={18} />, count: counts.projects },
    { id: '3d-models' as TabId, label: 'Add Your 3D & Models', icon: <Box size={18} />, count: counts.models3d },
    { id: 'banners' as TabId, label: 'Banners & Alert Bar', icon: <Megaphone size={18} />, count: counts.banners },
    { id: 'gallery' as TabId, label: 'Field Gallery & Media', icon: <Camera size={18} />, count: counts.gallery },
    { id: 'events' as TabId, label: 'Events & Hackathons', icon: <Calendar size={18} />, count: counts.events },
    { id: 'achievements' as TabId, label: 'Achievements', icon: <Trophy size={18} />, count: counts.achievements },
    { id: 'members' as TabId, label: 'Leadership & Team', icon: <Users size={18} />, count: counts.members },
    { id: 'alumni' as TabId, label: 'Alumni Directory', icon: <GraduationCap size={18} />, count: counts.alumni },
    { id: 'settings' as TabId, label: 'Site & Announcement Controls', icon: <SettingsIcon size={18} /> },
    { id: 'applications' as TabId, label: 'Membership Applications', icon: <FileText size={18} />, count: counts.applications },
  ];

  return (
    <aside
      style={{
        width: '280px',
        backgroundColor: '#0D0F14',
        borderRight: '1px solid #232838',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid #232838' }}>
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
            }}
          >
            <Cpu size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '0.5px' }}>TRAIC STUDIO</div>
            <div style={{ fontSize: '11px', color: '#9AA3B5', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Coordinator Console
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: activeTab === tab.id ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                backgroundColor: activeTab === tab.id ? '#141821' : 'transparent',
                color: activeTab === tab.id ? '#38BDF8' : '#9AA3B5',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {tab.icon}
                <span>{tab.label}</span>
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
      <div style={{ borderTop: '1px solid #232838', paddingTop: '16px' }}>
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
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync Live API Data</span>
        </button>
      </div>
    </aside>
  );
}
