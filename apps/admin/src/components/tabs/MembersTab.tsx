import { Edit2, Trash2, Users } from 'lucide-react';
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
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '700px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#8E8E93', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Lead Name & Profile</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Role / Domain</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Academic Cohort</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Bio Narrative</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Visibility</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#8E8E93' }}>
                <Users size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No leadership members configured yet.</p>
              </td>
            </tr>
          ) : (
            members.map((m) => {
              const isPublished = m.status === 'PUBLISHED';
              const initials = m.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('');

              return (
                <tr
                  key={m.id || m.name}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 113, 227, 0.15)',
                          border: '1px solid rgba(0, 113, 227, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2997FF',
                          fontWeight: 700,
                          fontSize: '12px',
                          fontFamily: '"SF Mono", monospace',
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>
                      <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '14px' }}>{m.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(0, 113, 227, 0.15)',
                        color: '#2997FF',
                        border: '1px solid rgba(0, 113, 227, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontFamily: '"SF Mono", monospace',
                        fontWeight: 700,
                      }}
                    >
                      {m.role || (m as any).position}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#A1A1A6', fontFamily: '"SF Mono", monospace' }}>
                    {(m as any).academicYear || 'Class of 2026'}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#8E8E93', maxWidth: '280px', fontSize: '12px', lineHeight: 1.4 }}>
                    {m.bio}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <QuickVisibilityToggle
                      isPublished={isPublished}
                      onToggle={() => onToggleVisibility && m.id && onToggleVisibility(m.id, m.status || 'DRAFT')}
                    />
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onEdit(m)}
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
                        title="Edit Member"
                        aria-label="Edit Member"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => m.id && onDelete(m.id)}
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
                        title="Delete Member"
                        aria-label="Delete Member"
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
        {members.length === 0 ? (
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
            <Users size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No leadership members configured yet.</p>
          </div>
        ) : (
          members.map((m) => {
            const isPublished = m.status === 'PUBLISHED';
            const initials = m.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('');

            return (
              <div
                key={m.id || m.name}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 113, 227, 0.15)',
                      color: '#2997FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13px',
                      flexShrink: 0,
                    }}
                  >
                    {m.photoUrl ? (
                      <img
                        src={m.photoUrl}
                        alt={m.name}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '15px' }}>{m.name}</div>
                    <div style={{ fontSize: '12px', color: '#2997FF', marginTop: '2px' }}>{m.role}</div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#8E8E93',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontFamily: 'var(--font-family-mono, monospace)',
                      flexShrink: 0,
                    }}
                  >
                    {m.academicYear || 'Active'}
                  </span>
                </div>

                {m.bio && (
                  <div style={{ fontSize: '12.5px', color: '#8E8E93', lineHeight: 1.4 }}>
                    {m.bio}
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
                      isPublished={isPublished}
                      onToggle={() => onToggleVisibility && m.id && onToggleVisibility(m.id, m.status || 'DRAFT')}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => onEdit(m)}
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
                      title="Edit Member"
                      aria-label="Edit Member"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => m.id && onDelete(m.id)}
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
                      title="Delete Member"
                      aria-label="Delete Member"
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
