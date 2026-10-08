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
        return { bg: 'rgba(0, 113, 227, 0.15)', color: '#2997FF', border: 'rgba(0, 113, 227, 0.35)' };
      case 'SOLDERING':
        return { bg: 'rgba(255, 159, 10, 0.12)', color: '#FF9F0A', border: 'rgba(255, 159, 10, 0.3)' };
      case 'FABRICATION':
        return { bg: 'rgba(48, 209, 88, 0.12)', color: '#30D158', border: 'rgba(48, 209, 88, 0.3)' };
      case 'COMPUTE':
        return { bg: 'rgba(191, 90, 242, 0.12)', color: '#BF5AF2', border: 'rgba(191, 90, 242, 0.3)' };
      case 'ROBOTICS':
        return { bg: 'rgba(0, 113, 227, 0.15)', color: '#2997FF', border: 'rgba(0, 113, 227, 0.4)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.08)', color: '#E5E5EA', border: 'rgba(255, 255, 255, 0.15)' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return { label: 'Operational', color: '#30D158', dot: '#30D158' };
      case 'IN_USE':
        return { label: 'In Use', color: '#FF9F0A', dot: '#FF9F0A' };
      case 'MAINTENANCE':
        return { label: 'Maintenance', color: '#FF453A', dot: '#FF453A' };
      default:
        return { label: status, color: '#8E8E93', dot: '#8E8E93' };
    }
  };

  return (
    <div>
      {/* Desktop Table View (>= 768px) */}
      <div
        className="admin-table-wrap admin-desktop-table"
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '18px',
          overflowX: 'auto',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '780px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#8E8E93', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Instrument & Model</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Category</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Lab Specifications</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Operational Status</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Visibility</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gear.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#8E8E93' }}>
                <Wrench size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No workshop instruments configured yet.</p>
              </td>
            </tr>
          ) : (
            gear.map((item) => {
              const catStyle = getCategoryBadgeStyle(item.category);
              const status = getStatusBadge(item.status);
              const isPublished = item.isPublished !== false;

              return (
                <tr
                  key={item.id || item.name}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '14px' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#2997FF', fontFamily: '"JetBrains Mono", monospace', marginTop: '2px' }}>
                      {item.model}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        backgroundColor: catStyle.bg,
                        color: catStyle.color,
                        border: `1px solid ${catStyle.border}`,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', maxWidth: '320px', color: '#A1A1A6', fontSize: '12px', lineHeight: 1.4 }}>
                    {item.specifications}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: status.color, fontWeight: 600 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: status.dot, boxShadow: `0 0 8px ${status.dot}` }} />
                      {status.label}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <QuickVisibilityToggle
                      isPublished={isPublished}
                      onToggle={() => onToggleVisibility && item.id && onToggleVisibility(item.id)}
                    />
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#2997FF',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          minHeight: '44px',
                          minWidth: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Edit Gear"
                        aria-label="Edit Gear"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => item.id && onDelete(item.id)}
                        style={{
                          background: 'rgba(255, 69, 58, 0.08)',
                          border: '1px solid rgba(255, 69, 58, 0.2)',
                          color: '#FF453A',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          minHeight: '44px',
                          minWidth: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Delete Gear"
                        aria-label="Delete Gear"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>

      {/* Mobile Card List (< 768px) - Apple Inset Grouped */}
      <div className="admin-mobile-card-list">
        {gear.length === 0 ? (
          <div
            style={{
              backgroundColor: '#1C1C1E',
              borderRadius: '16px',
              padding: '36px 20px',
              textAlign: 'center',
              color: '#8E8E93',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Wrench size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No workshop instruments configured yet.</p>
          </div>
        ) : (
          gear.map((item) => {
            const catStyle = getCategoryBadgeStyle(item.category);
            const status = getStatusBadge(item.status);
            const isPublished = item.isPublished !== false;

            return (
              <div
                key={item.id || item.name}
                style={{
                  backgroundColor: '#1C1C1E',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '15px', lineHeight: 1.3 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#2997FF', fontFamily: 'var(--font-family-mono, monospace)', marginTop: '2px' }}>
                      {item.model}
                    </div>
                  </div>
                  <span
                    style={{
                      backgroundColor: catStyle.bg,
                      color: catStyle.color,
                      border: `1px solid ${catStyle.border}`,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-family-mono, monospace)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', color: '#A1A1A6', lineHeight: 1.4 }}>
                  {item.specifications}
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: status.color, fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: status.dot, boxShadow: `0 0 8px ${status.dot}` }} />
                  <span>{status.label}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#8E8E93' }}>Visibility:</span>
                    <QuickVisibilityToggle
                      isPublished={isPublished}
                      onToggle={() => onToggleVisibility && item.id && onToggleVisibility(item.id)}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#2997FF',
                        borderRadius: '980px',
                        cursor: 'pointer',
                        minHeight: '44px',
                        minWidth: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 14px',
                        gap: '6px',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                      title="Edit Gear"
                      aria-label="Edit Gear"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => item.id && onDelete(item.id)}
                      style={{
                        background: 'rgba(255, 69, 58, 0.08)',
                        border: '1px solid rgba(255, 69, 58, 0.2)',
                        color: '#FF453A',
                        borderRadius: '980px',
                        cursor: 'pointer',
                        minHeight: '44px',
                        minWidth: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Delete Gear"
                      aria-label="Delete Gear"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
