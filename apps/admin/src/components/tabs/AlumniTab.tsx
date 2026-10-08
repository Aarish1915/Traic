import { Edit2, Trash2, GraduationCap, Building2 } from 'lucide-react';
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
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '740px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#8E8E93', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Alumnus & Batch</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Current Industry Role</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Organization / Lab</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Testimonial Quote</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Visibility</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alumni.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#8E8E93' }}>
                <GraduationCap size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No alumni profiles recorded yet.</p>
              </td>
            </tr>
          ) : (
            alumni.map((al) => {
              const isActive = (al as any).active !== false;
              return (
                <tr
                  key={al.id || al.name}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '14px' }}>{al.name}</div>
                    <div style={{ fontSize: '11px', color: '#2997FF', fontFamily: '"JetBrains Mono", monospace', marginTop: '2px' }}>
                      Class of {al.batch}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#F5F5F7', fontWeight: 500 }}>
                    {al.currentRole}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2997FF', fontWeight: 600 }}>
                      <Building2 size={13} />
                      <span>{al.company}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#8E8E93', fontStyle: 'italic', maxWidth: '280px', fontSize: '12px', lineHeight: 1.4 }}>
                    &ldquo;{al.quote}&rdquo;
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <QuickVisibilityToggle
                      isPublished={isActive}
                      label={isActive ? 'ACTIVE' : 'INACTIVE'}
                      onToggle={() => onToggleVisibility && al.id && onToggleVisibility(al.id, isActive)}
                    />
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onEdit(al)}
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
                        title="Edit Alumnus"
                        aria-label="Edit Alumnus"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => al.id && onDelete(al.id)}
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
                        title="Delete Alumnus"
                        aria-label="Delete Alumnus"
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
        {alumni.length === 0 ? (
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
            <GraduationCap size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No alumni profiles recorded yet.</p>
          </div>
        ) : (
          alumni.map((al) => {
            const isActive = (al as any).active !== false;

            return (
              <div
                key={al.id || al.name}
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
                    <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '15px' }}>{al.name}</div>
                    <div style={{ fontSize: '12px', color: '#2997FF', marginTop: '2px' }}>{al.role}</div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#2997FF',
                      backgroundColor: 'rgba(0, 113, 227, 0.15)',
                      border: '1px solid rgba(0, 113, 227, 0.35)',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontFamily: 'var(--font-family-mono, monospace)',
                      flexShrink: 0,
                    }}
                  >
                    Class of {al.batch}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#F5F5F7' }}>
                  <Building2 size={14} style={{ color: '#8E8E93' }} />
                  <span>{al.company}</span>
                </div>

                {al.quote && (
                  <div style={{ fontSize: '12px', color: '#8E8E93', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{al.quote}"
                  </div>
                )}

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
                      isPublished={isActive}
                      onToggle={() => onToggleVisibility && al.id && onToggleVisibility(al.id, isActive)}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => onEdit(al)}
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
                      title="Edit Alumnus"
                      aria-label="Edit Alumnus"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => al.id && onDelete(al.id)}
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
                      title="Delete Alumnus"
                      aria-label="Delete Alumnus"
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
