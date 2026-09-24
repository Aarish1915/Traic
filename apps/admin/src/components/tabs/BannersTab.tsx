import { Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
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
          padding: '14px 16px',
          borderRadius: '8px',
          backgroundColor: '#141821',
          border: '1px solid #232838',
          fontSize: '13px',
          color: '#9AA3B5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ flex: 1, minWidth: '200px' }}>
          <strong style={{ color: '#E8EAF0' }}>Top Alert Bar Control:</strong> The highest-priority active banner is displayed across the top of all public pages on the website.
        </div>
        <button
          onClick={onCreate}
          style={{ backgroundColor: '#FF9F1C', color: '#07080B', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}
        >
          + Add New Banner
        </button>
      </div>

      <div className="admin-table-wrap" style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '680px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
              <th style={{ padding: '14px 16px' }}>Banner Title & Message</th>
              <th style={{ padding: '14px 16px' }}>Type Badge</th>
              <th style={{ padding: '14px 16px' }}>Target Link</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id || b.title} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
                <td style={{ padding: '14px 16px', maxWidth: '380px' }}>
                  <div style={{ fontWeight: 700, color: '#E8EAF0' }}>{b.title}</div>
                  <div style={{ fontSize: '12px', color: '#9AA3B5', marginTop: '2px' }}>{b.message}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      backgroundColor:
                        b.type === 'URGENT'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : b.type === 'EVENT'
                          ? 'rgba(56, 189, 248, 0.15)'
                          : b.type === 'ACHIEVEMENT'
                          ? 'rgba(52, 211, 153, 0.15)'
                          : 'rgba(255, 159, 28, 0.15)',
                      color:
                        b.type === 'URGENT'
                          ? '#F87171'
                          : b.type === 'EVENT'
                          ? '#38BDF8'
                          : b.type === 'ACHIEVEMENT'
                          ? '#34D399'
                          : '#FF9F1C',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                    }}
                  >
                    {b.type} (P{b.priority})
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px' }}>
                  {b.linkUrl ? (
                    <a href={b.linkUrl} target="_blank" rel="noreferrer" style={{ color: '#38BDF8', textDecoration: 'none' }}>
                      {b.linkText || b.linkUrl}
                    </a>
                  ) : (
                    <span style={{ color: '#64748B' }}>None</span>
                  )}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button
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
                      color: b.isActive ? '#34D399' : '#9AA3B5',
                    }}
                  >
                    {b.isActive ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span>{b.isActive ? 'Active (Live)' : 'Paused'}</span>
                  </button>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button
                    onClick={() => onEdit(b)}
                    style={{ background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => b.id && onDelete(b.id)}
                    style={{ background: 'none', border: '1px solid #232838', color: '#F87171', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
