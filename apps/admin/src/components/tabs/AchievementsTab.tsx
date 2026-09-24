import { Edit2, Trash2 } from 'lucide-react';
import type { Achievement } from '@traic/shared';
import { QuickVisibilityToggle } from '../QuickVisibilityToggle';

interface AchievementsTabProps {
  achievements: Achievement[];
  onEdit: (item: Achievement) => void;
  onDelete: (id: string) => void;
  onToggleVisibility?: (id: string, currentStatus: string) => void;
}

export function AchievementsTab({ achievements, onEdit, onDelete, onToggleVisibility }: AchievementsTabProps) {
  return (
    <div className="admin-table-wrap" style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '660px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
            <th style={{ padding: '14px 16px' }}>Award / Title</th>
            <th style={{ padding: '14px 16px' }}>Event Name</th>
            <th style={{ padding: '14px 16px' }}>Level</th>
            <th style={{ padding: '14px 16px' }}>Rank / Honor</th>
            <th style={{ padding: '14px 16px' }}>Date</th>
            <th style={{ padding: '14px 16px' }}>Visibility</th>
            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((a) => {
            const isPublished = (a as any).status !== 'DRAFT';
            return (
              <tr key={a.id || a.title} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{a.title}</td>
                <td style={{ padding: '14px 16px', color: '#38BDF8' }}>{a.eventName}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ backgroundColor: '#07080B', border: '1px solid #232838', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}>
                    {a.level}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#FF9F1C', fontWeight: 600 }}>{a.rank}</td>
                <td style={{ padding: '14px 16px', color: '#9AA3B5' }}>{a.date}</td>
                <td style={{ padding: '14px 16px' }}>
                  <QuickVisibilityToggle
                    isPublished={isPublished}
                    onToggle={() => onToggleVisibility && a.id && onToggleVisibility(a.id, (a as any).status || 'PUBLISHED')}
                  />
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => onEdit(a)}
                    style={{ background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}
                    title="Edit Achievement"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => a.id && onDelete(a.id)}
                    style={{ background: 'none', border: '1px solid #232838', color: '#F87171', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    title="Delete Achievement"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
