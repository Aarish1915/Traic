import { Plus } from 'lucide-react';
import type { TabId } from '../types';

interface HeaderProps {
  activeTab: TabId;
  onCreateNew: () => void;
}

export function Header({ activeTab, onCreateNew }: HeaderProps) {
  const titles: Record<TabId, { title: string; subtitle: string; category: string }> = {
    settings: {
      category: 'System',
      title: 'Site Configuration & Copy',
      subtitle: 'Dynamic control over hero copy, mission statements, benchmark stats, and section toggles',
    },
    projects: {
      category: 'Showcase',
      title: 'Flagship Projects',
      subtitle: 'Hardware prototypes, autonomous rovers, silicon BOMs, and engineering repositories',
    },
    gear: {
      category: 'Facilities',
      title: 'Workshop & Laboratory Gear',
      subtitle: 'Test bench instruments, oscilloscopes, SMD rework stations, and live operational status',
    },
    banners: {
      category: 'Communications',
      title: 'Announcement & Alert Banners',
      subtitle: 'Real-time emergency notices, event teasers, and top floating alert ribbons',
    },
    gallery: {
      category: 'Media',
      title: 'Field Media & Dispatches',
      subtitle: 'High-resolution lab prototyping photography, hackathon victory moments, and media',
    },
    events: {
      category: 'Programs',
      title: 'Events & Hackathons',
      subtitle: 'Autonomous robotics competitions, hands-on workshops, and registration management',
    },
    achievements: {
      category: 'Accolades',
      title: 'National Honors & Laurels',
      subtitle: 'Smart India Hackathon trophies, DD Robocon ranks, patents, and official validations',
    },
    members: {
      category: 'Organization',
      title: 'Leadership & Domain Leads',
      subtitle: 'Student coordinators, technical leads, domain specializations, and alumni',
    },
    alumni: {
      category: 'Community',
      title: 'Distinguished Alumni',
      subtitle: 'Graduated members now at Tesla, ISRO, Texas Instruments, and global industry labs',
    },
    applications: {
      category: 'Recruitment',
      title: 'Admissions & Cohort Applications',
      subtitle: 'Student recruitment candidate review pipeline with statutory DPDP Act 2023 compliance audit',
    },
  };

  const showCreateButton =
    activeTab !== 'settings' && activeTab !== 'applications';

  const createLabels: Record<string, string> = {
    projects: 'Project',
    gear: 'Instrument / Tool',
    banners: 'Alert Banner',
    gallery: 'Field Photo',
    events: 'Event / Hackathon',
    achievements: 'National Honor',
    members: 'Team Lead',
    alumni: 'Alumni Profile',
  };

  const meta = titles[activeTab] || { category: 'Collection', title: `${activeTab} Management`, subtitle: 'Manage collection records' };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '28px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#86868B',
            }}
          >
            {meta.category}
          </span>
          <span style={{ color: '#48484A', fontSize: '11px' }}>/</span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#2997FF',
              letterSpacing: '0.02em',
            }}
          >
            TRAIC Admin
          </span>
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(22px, 3vw, 26px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#F5F5F7',
            lineHeight: 1.25,
          }}
        >
          {meta.title}
        </h1>
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: '13.5px',
            color: '#86868B',
            lineHeight: 1.4,
          }}
        >
          {meta.subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {showCreateButton && (
          <button
            type="button"
            onClick={onCreateNew}
            className="apple-button-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0071E3',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '980px',
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minHeight: '44px',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget.style.backgroundColor = '#0077ED'))}
            onMouseOut={(e) => ((e.currentTarget.style.backgroundColor = '#0071E3'))}
            onMouseDown={(e) => ((e.currentTarget.style.transform = 'scale(0.985)'))}
            onMouseUp={(e) => ((e.currentTarget.style.transform = 'scale(1)'))}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add {createLabels[activeTab] || 'New Item'}</span>
          </button>
        )}
      </div>
    </header>
  );
}
