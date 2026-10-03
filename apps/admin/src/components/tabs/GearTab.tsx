import { Edit2, Trash2, Wrench } from 'lucide-react';
import type { LabGear } from '@traic/shared';
import { QuickVisibilityToggle } from '../QuickVisibilityToggle';

interface GearTabProps {
  gear: LabGear[];
  onEdit: (item: LabGear) => void;
  onDelete: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
}

export function GearTab({ gear, onEdit, onDelete, onToggleVisibility }: GearTabProps) {
  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'TESTING':
        return { bg: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', border: 'rgba(0, 229, 255, 0.3)' };
      case 'SOLDERING':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' };
      case 'FABRICATION':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: 'rgba(16, 185, 129, 0.3)' };
      case 'COMPUTE':
        return { bg: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: 'rgba(56, 189, 248, 0.3)' };
      case 'ROBOTICS':
        return { bg: 'rgba(168, 85, 247, 0.1)', color: '#C084FC', border: 'rgba(168, 85, 247, 0.3)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94A3B8', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return { label: 'Operational', color: '#34D399', dot: '#10B981' };
      case 'IN_USE':
        return { label: 'In Use', color: '#FBBF24', dot: '#F59E0B' };
      case 'MAINTENANCE':
        return { label: 'Maintenance', color: '#F87171', dot: '#EF4444' };
      default:
        return { label: status, color: '#94A3B8', dot: '#64748B' };
    }
  };

  return (
    <div className="admin-table-wrap" style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '780px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
            <th style={{ padding: '14px 16px' }}>Equipment & Model</th>
            <th style={{ padding: '14px 16px' }}>Category</th>
            <th style={{ padding: '14px 16px' }}>Specifications</th>
            <th style={{ padding: '14px 16px' }}>Status</th>
            <th style={{ padding: '14px 16px' }}>Priority</th>
            <th style={{ padding: '14px 16px' }}>Visibility</th>
            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gear.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
                <Wrench size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p>No lab equipment items configured yet.</p>
              </td>
            </tr>
          ) : (
            gear.map((item) => {
              const catStyle = getCategoryBadgeStyle(item.category);
              const status = getStatusBadge(item.status);
              const isPublished = item.isPublished !== false;

              return (
                <tr key={item.id || item.name} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace', marginTop: '2px' }}>
                      {item.model}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        backgroundColor: catStyle.bg,
                        color: catStyle.color,
                        border: `1px solid ${catStyle.border}`,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        fontFamily: 'monospace',
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', maxWidth: '300px', color: '#94A3B8', fontSize: '12px', lineHeight: 1.4 }}>
                    {item.specifications}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: status.color, fontWeight: 600 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: status.dot }} />
                      {status.label}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#9AA3B5', fontFamily: 'monospace' }}>
                    #{item.priority ?? 1}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <QuickVisibilityToggle
                      isPublished={isPublished}
                      onToggle={() => onToggleVisibility && item.id && onToggleVisibility(item.id)}
                    />
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      style={{ background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}
                      title="Edit Gear"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => item.id && onDelete(item.id)}
                      style={{ background: 'none', border: '1px solid #232838', color: '#F87171', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}
                      title="Delete Gear"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
