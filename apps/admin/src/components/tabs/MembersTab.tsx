import { Edit2, Trash2 } from 'lucide-react';
import type { Member } from '@traic/shared';
import { QuickVisibilityToggle } from '../QuickVisibilityToggle';

interface MembersTabProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onToggleVisibility?: (id: string, currentStatus: string) => void;
}

export function MembersTab({ members, onEdit, onDelete, onToggleVisibility }: MembersTabProps) {
  return (
    <div className="admin-table-wrap" style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '640px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
            <th style={{ padding: '14px 16px' }}>Name</th>
            <th style={{ padding: '14px 16px' }}>Position</th>
            <th style={{ padding: '14px 16px' }}>Academic Year</th>
            <th style={{ padding: '14px 16px' }}>Bio</th>
            <th style={{ padding: '14px 16px' }}>Visibility</th>
            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => {
            const isPublished = m.status === 'PUBLISHED';
            return (
              <tr key={m.id || m.name} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{m.name}</td>
                <td style={{ padding: '14px 16px', color: '#FF9F1C', fontFamily: 'monospace' }}>{m.position}</td>
                <td style={{ padding: '14px 16px' }}>{m.academicYear}</td>
                <td style={{ padding: '14px 16px', color: '#9AA3B5', maxWidth: '260px' }}>{m.bio}</td>
                <td style={{ padding: '14px 16px' }}>
                  <QuickVisibilityToggle
                    isPublished={isPublished}
                    onToggle={() => onToggleVisibility && m.id && onToggleVisibility(m.id, m.status || 'DRAFT')}
                  />
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => onEdit(m)}
                    style={{ background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}
                    title="Edit Member"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => m.id && onDelete(m.id)}
                    style={{ background: 'none', border: '1px solid #232838', color: '#F87171', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    title="Delete Member"
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
