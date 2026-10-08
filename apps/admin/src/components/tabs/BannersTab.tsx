import { Edit2, Trash2, CheckCircle2, AlertCircle, Megaphone, Plus } from 'lucide-react';
import type { Banner } from '@traic/shared';

interface BannersTabProps {
  banners: Banner[];
  onToggleBanner: (banner: Banner) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export function BannersTab({ banners, onToggleBanner, onEdit, onDelete, onCreate }: BannersTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div
        className="admin-info-bar"
        style={{
          padding: '16px 20px',
          borderRadius: '16px',
          backgroundColor: '#1C1C1E',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '13px',
          color: '#A1A1A6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Megaphone size={18} style={{ color: '#2997FF' }} />
          <span>
            <strong style={{ color: '#F5F5F7' }}>Top Alert Bar Control:</strong> The highest-priority active banner is rendered dynamically at the top of all public pages.
          </span>
        </div>
        <button
          type="button"
          onClick={onCreate}
          style={{
            backgroundColor: '#0071E3',
            color: '#FFFFFF',
            border: 'none',
            padding: '9px 18px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '44px',
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Add New Banner</span>
        </button>
      </div>

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
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Banner Title & Copy</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Type & Priority</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Target Destination</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Status</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: '#8E8E93' }}>
                  <Megaphone size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No alert banners configured.</p>
                </td>
              </tr>
            ) : (
              banners.map((b) => (
                <tr
                  key={b.id || b.title}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '16px 20px', maxWidth: '380px' }}>
                    <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '14px' }}>{b.title}</div>
                    <div style={{ fontSize: '12px', color: '#8E8E93', marginTop: '2px', lineHeight: 1.3 }}>{b.message}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        backgroundColor:
                          b.type === 'URGENT'
                            ? 'rgba(255, 69, 58, 0.15)'
                            : b.type === 'EVENT'
                            ? 'rgba(0, 113, 227, 0.15)'
                            : b.type === 'ACHIEVEMENT'
                            ? 'rgba(48, 209, 88, 0.15)'
                            : 'rgba(255, 255, 255, 0.08)',
                        color:
                          b.type === 'URGENT'
                            ? '#FF453A'
                            : b.type === 'EVENT'
                            ? '#2997FF'
                            : b.type === 'ACHIEVEMENT'
                            ? '#30D158'
                            : '#F5F5F7',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 700,
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {b.type} (P{b.priority})
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px' }}>
                    {b.linkUrl ? (
                      <a href={b.linkUrl} target="_blank" rel="noreferrer" style={{ color: '#2997FF', textDecoration: 'none' }}>
                        {b.linkText || b.linkUrl}
                      </a>
                    ) : (
                      <span style={{ color: '#8E8E93' }}>None</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      type="button"
                      onClick={() => onToggleBanner(b)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: b.isActive ? '#30D158' : '#8E8E93',
                        minHeight: '44px',
                      }}
                    >
                      {b.isActive ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      <span>{b.isActive ? 'Active (Live)' : 'Paused'}</span>
                    </button>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onEdit(b)}
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
                        title="Edit Banner"
                        aria-label="Edit Banner"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => b.id && onDelete(b.id)}
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
                        title="Delete Banner"
                        aria-label="Delete Banner"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (< 768px) - Apple Inset Grouped */}
      <div className="admin-mobile-card-list">
        {banners.length === 0 ? (
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
            <Megaphone size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No alert banners configured.</p>
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id || b.title}
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
                  {b.title}
                </div>
                <span
                  style={{
                    backgroundColor:
                      b.type === 'URGENT'
                        ? 'rgba(255, 69, 58, 0.15)'
                        : b.type === 'EVENT'
                        ? 'rgba(0, 113, 227, 0.15)'
                        : b.type === 'ACHIEVEMENT'
                        ? 'rgba(48, 209, 88, 0.15)'
                        : 'rgba(255, 255, 255, 0.08)',
                    color:
                      b.type === 'URGENT'
                        ? '#FF453A'
                        : b.type === 'EVENT'
                        ? '#2997FF'
                        : b.type === 'ACHIEVEMENT'
                        ? '#30D158'
                        : '#F5F5F7',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-family-mono, monospace)',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {b.type} (P{b.priority})
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: '#8E8E93', lineHeight: 1.4 }}>
                {b.message}
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
                <button
                  type="button"
                  onClick={() => onToggleBanner(b)}
                  style={{
                    backgroundColor: b.isActive ? 'rgba(48, 209, 88, 0.12)' : 'rgba(255, 255, 255, 0.06)',
                    color: b.isActive ? '#30D158' : '#8E8E93',
                    border: `1px solid ${b.isActive ? 'rgba(48, 209, 88, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    padding: '6px 12px',
                    borderRadius: '980px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {b.isActive ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                  <span>{b.isActive ? 'Active' : 'Inactive'}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => onEdit(b)}
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
                    title="Edit Banner"
                    aria-label="Edit Banner"
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => b.id && onDelete(b.id)}
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
                    title="Delete Banner"
                    aria-label="Delete Banner"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
