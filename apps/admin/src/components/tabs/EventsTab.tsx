import { Edit2, Trash2 } from 'lucide-react';
import type { Event } from '@traic/shared';
import { QuickVisibilityToggle } from '../QuickVisibilityToggle';

interface EventsTabProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onToggleVisibility?: (id: string, currentStatus: string) => void;
}

export function EventsTab({ events, onEdit, onDelete, onToggleVisibility }: EventsTabProps) {
  return (
    <div className="admin-table-wrap" style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '680px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
            <th style={{ padding: '14px 16px' }}>Event Name</th>
            <th style={{ padding: '14px 16px' }}>Type</th>
            <th style={{ padding: '14px 16px' }}>Mode</th>
            <th style={{ padding: '14px 16px' }}>Date</th>
            <th style={{ padding: '14px 16px' }}>Venue</th>
            <th style={{ padding: '14px 16px' }}>Visibility</th>
            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => {
            const isPublished = e.status === 'PUBLISHED';
            return (
              <tr key={e.id || e.slug} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                  <div>{e.title}</div>
                  <div style={{ fontSize: '11px', color: '#9AA3B5' }}>{e.tagline}</div>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace' }}>{e.type}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ backgroundColor: '#07080B', border: '1px solid #232838', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>
                    {e.mode}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#38BDF8', fontSize: '12px' }}>
                  {new Date(e.startsAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '14px 16px', color: '#9AA3B5' }}>{e.venue}</td>
                <td style={{ padding: '14px 16px' }}>
                  <QuickVisibilityToggle
                    isPublished={isPublished}
                    onToggle={() => onToggleVisibility && e.id && onToggleVisibility(e.id, e.status || 'DRAFT')}
                  />
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => onEdit(e)}
                    style={{ background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}
                    title="Edit Event"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => e.id && onDelete(e.id)}
                    style={{ background: 'none', border: '1px solid #232838', color: '#F87171', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    title="Delete Event"
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
