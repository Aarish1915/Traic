import { Edit2, Trash2 } from 'lucide-react';
import type { Alumni } from '@traic/shared';
import { QuickVisibilityToggle } from '../QuickVisibilityToggle';

interface AlumniTabProps {
  alumni: Alumni[];
  onEdit: (alumnus: Alumni) => void;
  onDelete: (id: string) => void;
  onToggleVisibility?: (id: string, currentActive: boolean) => void;
}

export function AlumniTab({ alumni, onEdit, onDelete, onToggleVisibility }: AlumniTabProps) {
  return (
    <div className="admin-table-wrap" style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '700px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
            <th style={{ padding: '14px 16px' }}>Name</th>
            <th style={{ padding: '14px 16px' }}>Batch</th>
            <th style={{ padding: '14px 16px' }}>Current Role</th>
            <th style={{ padding: '14px 16px' }}>Company</th>
            <th style={{ padding: '14px 16px' }}>Quote</th>
            <th style={{ padding: '14px 16px' }}>Status</th>
            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alumni.map((al) => {
            const isActive = (al as any).active !== false;
            return (
              <tr key={al.id || al.name} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{al.name}</td>
                <td style={{ padding: '14px 16px', color: '#FF9F1C', fontFamily: 'monospace' }}>Class of {al.batch}</td>
                <td style={{ padding: '14px 16px' }}>{al.currentRole}</td>
                <td style={{ padding: '14px 16px', color: '#38BDF8' }}>{al.company}</td>
                <td style={{ padding: '14px 16px', color: '#9AA3B5', fontStyle: 'italic', maxWidth: '260px' }}>&ldquo;{al.quote}&rdquo;</td>
                <td style={{ padding: '14px 16px' }}>
                  <QuickVisibilityToggle
                    isPublished={isActive}
                    label={isActive ? 'ACTIVE' : 'INACTIVE'}
                    onToggle={() => onToggleVisibility && al.id && onToggleVisibility(al.id, isActive)}
                  />
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => onEdit(al)}
                    style={{ background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}
                    title="Edit Alumnus"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => al.id && onDelete(al.id)}
                    style={{ background: 'none', border: '1px solid #232838', color: '#F87171', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    title="Delete Alumnus"
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
