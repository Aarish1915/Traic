import { useState } from 'react';
import { Cpu, Layers, Trophy, Calendar, Users, LogOut, CheckCircle2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'projects' | 'events' | 'achievements' | 'applications'>('projects');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#07080B', color: '#E8EAF0' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#0D0F14', borderRight: '1px solid #232838', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '24px', borderBottom: '1px solid #232838' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255, 159, 28, 0.15)', border: '1px solid rgba(255, 159, 28, 0.4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9F1C' }}>
              <Cpu size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px' }}>TRAIC ADMIN</div>
              <div style={{ fontSize: '11px', color: '#9AA3B5', textTransform: 'uppercase', letterSpacing: '1px' }}>Coordinator Console</div>
            </div>
          </div>

          <nav style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'projects', label: 'Projects', icon: <Layers size={18} /> },
              { id: 'events', label: 'Events & Hackathons', icon: <Calendar size={18} /> },
              { id: 'achievements', label: 'Achievements', icon: <Trophy size={18} /> },
              { id: 'applications', label: 'Join Applications', icon: <Users size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: activeTab === tab.id ? '1px solid #232838' : '1px solid transparent',
                  backgroundColor: activeTab === tab.id ? '#141821' : 'transparent',
                  color: activeTab === tab.id ? '#38BDF8' : '#9AA3B5',
                  textAlign: 'left',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div style={{ borderTop: '1px solid #232838', paddingTop: '16px' }}>
          <div style={{ fontSize: '12px', color: '#9AA3B5', marginBottom: '8px' }}>
            Logged in as <strong>coordinator@traic.in</strong>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: '#141821',
              color: '#F87171',
              border: '1px solid #232838',
              fontSize: '12px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid #232838', marginBottom: '32px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, textTransform: 'capitalize' }}>
              {activeTab} Management
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#9AA3B5' }}>
              Publish, update, and manage entries verified against shared Zod schemas.
            </p>
          </div>
          <button
            style={{
              backgroundColor: '#FF9F1C',
              color: '#07080B',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            + Create New Entry
          </button>
        </header>

        {/* Dynamic Panel */}
        <div style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#34D399', fontSize: '13px', fontWeight: 600 }}>
            <CheckCircle2 size={16} />
            <span>Connected to TRAIC API Gateway (Local Monorepo)</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5' }}>
                <th style={{ padding: '12px 8px' }}>Title / Name</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Last Updated</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.4)' }}>
                <td style={{ padding: '14px 8px', fontWeight: 600 }}>Autonomous Field Rover (UGV-X)</td>
                <td style={{ padding: '14px 8px' }}>
                  <span style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    PUBLISHED
                  </span>
                </td>
                <td style={{ padding: '14px 8px', color: '#9AA3B5' }}>2024-12-20</td>
                <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}>Edit</button>
                  <button style={{ background: 'none', border: '1px solid #232838', color: '#F87171', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Archive</button>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.4)' }}>
                <td style={{ padding: '14px 8px', fontWeight: 600 }}>Edge Neural Accelerator Board</td>
                <td style={{ padding: '14px 8px' }}>
                  <span style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    PUBLISHED
                  </span>
                </td>
                <td style={{ padding: '14px 8px', color: '#9AA3B5' }}>2024-12-18</td>
                <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}>Edit</button>
                  <button style={{ background: 'none', border: '1px solid #232838', color: '#F87171', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Archive</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
