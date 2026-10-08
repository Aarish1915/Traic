import { Edit2, Trash2, Calendar, MapPin } from 'lucide-react';
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
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Event Name &amp; Summary</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Format</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Date &amp; Schedule</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Venue</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Visibility</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#8E8E93' }}>
                  <Calendar size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No events or hackathons configured yet.</p>
                </td>
              </tr>
            ) : (
              events.map((e) => {
                const isPublished = e.status === 'PUBLISHED';
                return (
                  <tr
                    key={e.id || e.slug}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '14px' }}>{e.title}</div>
                      <div style={{ fontSize: '12px', color: '#8E8E93', marginTop: '2px', lineHeight: 1.3 }}>{e.tagline || e.descriptionMd.slice(0, 70) + '...'}</div>
                      {e.prizePool && (
                        <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', color: '#FFD60A', fontWeight: 600 }}>
                          🏆 {e.prizePool} {e.teamSize ? `· ${e.teamSize}` : ''}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          backgroundColor: 'rgba(0, 113, 227, 0.15)',
                          color: '#2997FF',
                          border: '1px solid rgba(0, 113, 227, 0.35)',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-family-mono, monospace)',
                          fontWeight: 600,
                        }}
                      >
                        {e.type} · {e.mode}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#F5F5F7', fontSize: '12px', fontFamily: 'var(--font-family-mono, monospace)' }}>
                      {new Date(e.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#A1A1A6', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} style={{ color: '#8E8E93' }} />
                        <span>{e.venue}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <QuickVisibilityToggle
                        isPublished={isPublished}
                        onToggle={() => onToggleVisibility && e.id && onToggleVisibility(e.id, e.status || 'DRAFT')}
                      />
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => onEdit(e)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#2997FF',
                            borderRadius: '980px',
                            cursor: 'pointer',
                            minHeight: '44px',
                            minWidth: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Edit Event"
                          aria-label="Edit Event"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => e.id && onDelete(e.id)}
                          style={{
                            background: 'rgba(255, 69, 58, 0.08)',
                            border: '1px solid rgba(255, 69, 58, 0.2)',
                            color: '#FF453A',
                            borderRadius: '980px',
                            cursor: 'pointer',
                            minHeight: '44px',
                            minWidth: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Delete Event"
                          aria-label="Delete Event"
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
        {events.length === 0 ? (
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
            <Calendar size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No events configured yet.</p>
          </div>
        ) : (
          events.map((e) => {
            const isPublished = e.status === 'PUBLISHED';
            return (
              <div
                key={e.id || e.slug}
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
                  <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '15px', lineHeight: 1.3 }}>
                    {e.title}
                  </div>
                  <span
                    style={{
                      backgroundColor: 'rgba(0, 113, 227, 0.15)',
                      color: '#2997FF',
                      border: '1px solid rgba(0, 113, 227, 0.35)',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-family-mono, monospace)',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {e.type} · {e.mode}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', color: '#8E8E93', lineHeight: 1.4 }}>
                  {e.tagline || e.descriptionMd.slice(0, 85) + '...'}
                </div>

                {e.prizePool && (
                  <div style={{ fontSize: '12px', color: '#FFD60A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🏆</span>
                    <span>{e.prizePool} {e.teamSize ? `· ${e.teamSize}` : ''}</span>
                  </div>
                )}

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} style={{ color: '#8E8E93' }} />
                    <span style={{ fontFamily: 'var(--font-family-mono, monospace)' }}>
                      {new Date(e.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} style={{ color: '#8E8E93' }} />
                    <span>{e.venue}</span>
                  </div>
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
                      onToggle={() => onToggleVisibility && e.id && onToggleVisibility(e.id, e.status || 'DRAFT')}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => onEdit(e)}
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
                      title="Edit Event"
                      aria-label="Edit Event"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => e.id && onDelete(e.id)}
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
                      title="Delete Event"
                      aria-label="Delete Event"
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
