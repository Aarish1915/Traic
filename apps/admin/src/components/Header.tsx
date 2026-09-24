import { Plus } from 'lucide-react';
import type { TabId } from '../types';

interface HeaderProps {
  activeTab: TabId;
  onCreateNew: () => void;
}

export function Header({ activeTab, onCreateNew }: HeaderProps) {
  const titles: Record<TabId, string> = {
    settings: 'Site Controls & Announcement Banner',
    '3d-models': 'Add Your 3D Projects & Asset Pipeline',
    banners: 'Banners & Top Alert Bar Management',
    gallery: 'Field Gallery & Media Dispatches',
    projects: 'Projects & Hardware Management',
    events: 'Events & Hackathons Management',
    achievements: 'Achievements & Awards Management',
    members: 'Leadership & Team Management',
    alumni: 'Alumni Directory Management',
    applications: 'Membership Applications Review',
  };

  const showCreateButton =
    activeTab !== 'settings' && activeTab !== 'applications' && activeTab !== '3d-models';

  const createLabels: Record<string, string> = {
    projects: 'Project',
    banners: 'Banner',
    gallery: 'Field Photo / Dispatch',
    events: 'Event',
    achievements: 'Achievement',
    members: 'Member',
    alumni: 'Alumni Profile',
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '12px',
        paddingBottom: '20px',
        borderBottom: '1px solid #232838',
        marginBottom: '24px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#FF9F1C', letterSpacing: '1px' }}>
            ADMIN CONTROL //
          </span>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#34D399' }}>CONNECTED TO API</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 900, lineHeight: 1.2 }}>
          {titles[activeTab] || `${activeTab} Management`}
        </h1>
      </div>

      {showCreateButton && (
        <button
          onClick={onCreateNew}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FF9F1C',
            color: '#07080B',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255, 159, 28, 0.25)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <Plus size={16} />
          <span>Create New {createLabels[activeTab] || activeTab.slice(0, -1)}</span>
        </button>
      )}
    </header>
  );
}
