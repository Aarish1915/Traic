import { Edit2, Trash2, Trophy } from 'lucide-react';
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
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '720px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#8E8E93', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Award / Distinction</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Competition / Arena</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Tier</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Rank / Result</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Date</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Visibility</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {achievements.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#8E8E93' }}>
                <Trophy size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#FFD60A' }} />
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No achievements or laurels recorded yet.</p>
              </td>
            </tr>
          ) : (
            achievements.map((a) => {
              const isPublished = (a as any).status !== 'DRAFT';
              return (
                <tr
                  key={a.id || a.title}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#F5F5F7', fontSize: '14px' }}>
                    {a.title}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#2997FF', fontWeight: 500 }}>
                    {a.eventName}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 700,
                        color: '#E5E5EA',
                      }}
                    >
                      {a.level}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#FFD60A', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>
                    {a.rank}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#A1A1A6', fontFamily: '"JetBrains Mono", monospace' }}>
                    {a.date || a.year}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <QuickVisibilityToggle
                      isPublished={isPublished}
                      onToggle={() => onToggleVisibility && a.id && onToggleVisibility(a.id, (a as any).status || 'PUBLISHED')}
                    />
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onEdit(a)}
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
                        title="Edit Achievement"
                        aria-label="Edit Achievement"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => a.id && onDelete(a.id)}
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
                        title="Delete Achievement"
                        aria-label="Delete Achievement"
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
        {achievements.length === 0 ? (
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
            <Trophy size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#FFD60A' }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No achievements or laurels recorded yet.</p>
          </div>
        ) : (
          achievements.map((a) => {
            const isPublished = (a as any).status !== 'DRAFT';

            return (
              <div
                key={a.id || a.title}
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
                  <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '15px' }}>
                    {a.title}
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#FFD60A',
                      backgroundColor: 'rgba(255, 214, 10, 0.12)',
                      border: '1px solid rgba(255, 214, 10, 0.3)',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontFamily: 'var(--font-family-mono, monospace)',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {a.rank || a.award || 'Laurel'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#2997FF', fontWeight: 500 }}>
                  {a.eventName}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#A1A1A6',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                    {a.category}
                  </span>
                  <span style={{ fontFamily: 'var(--font-family-mono, monospace)' }}>
                    {a.date ? new Date(a.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Official'}
                  </span>
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
                      onToggle={() => onToggleVisibility && a.id && onToggleVisibility(a.id, a.status || 'DRAFT')}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => onEdit(a)}
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
                      title="Edit Achievement"
                      aria-label="Edit Achievement"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => a.id && onDelete(a.id)}
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
                      title="Delete Achievement"
                      aria-label="Delete Achievement"
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
