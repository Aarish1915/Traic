import { Edit2, Trash2 } from 'lucide-react';
import type { GalleryItem } from '@traic/shared';
import { QuickVisibilityToggle } from '../QuickVisibilityToggle';

interface GalleryTabProps {
  gallery: GalleryItem[];
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onToggleVisibility?: (id: string, currentActive: boolean) => void;
}

export function GalleryTab({ gallery, onEdit, onDelete, onCreate, onToggleVisibility }: GalleryTabProps) {
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
          <strong style={{ color: '#E8EAF0' }}>Field Dispatches & Photography:</strong> Manage high-resolution photos of real hardware builds, hackathons, lab sessions, and PCB soldering. Live sync to <code>/gallery</code> and the homepage preview.
        </div>
        <button
          onClick={onCreate}
          style={{
            backgroundColor: '#FF9F1C',
            color: '#07080B',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          + Add Field Photo / Dispatch
        </button>
      </div>

      <div className="admin-table-wrap" style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', minWidth: '760px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
              <th style={{ padding: '14px 16px', width: '80px' }}>Thumbnail</th>
              <th style={{ padding: '14px 16px' }}>Title & Caption</th>
              <th style={{ padding: '14px 16px' }}>Category</th>
              <th style={{ padding: '14px 16px' }}>Date & Location</th>
              <th style={{ padding: '14px 16px' }}>Featured</th>
              <th style={{ padding: '14px 16px' }}>Visibility</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gallery.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#9AA3B5' }}>
                  No gallery items yet. Click <strong style={{ color: '#FF9F1C' }}>+ Add Field Photo</strong> to get started.
                </td>
              </tr>
            ) : (
              gallery.map((g) => {
                const isActive = (g as any).active !== false;
                return (
                  <tr key={g.id || g.title} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ width: '56px', height: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #232838', backgroundColor: '#07080B' }}>
                        <img src={g.imageUrl} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.opacity = '0.3'; }} />
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', maxWidth: '260px' }}>
                      <div style={{ fontWeight: 700, color: '#E8EAF0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</div>
                      <div style={{ fontSize: '12px', color: '#9AA3B5', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.caption}</div>
                      {g.projectSlug && (
                        <span style={{ fontSize: '10px', color: '#38BDF8', fontFamily: 'monospace' }}>Project: {g.projectSlug}</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          backgroundColor:
                            g.category === 'COMPETITION'
                              ? 'rgba(52, 211, 153, 0.15)'
                              : g.category === 'ROBOTICS'
                              ? 'rgba(56, 189, 248, 0.15)'
                              : g.category === 'FABRICATION'
                              ? 'rgba(255, 159, 28, 0.15)'
                              : 'rgba(168, 85, 247, 0.15)',
                          color:
                            g.category === 'COMPETITION'
                              ? '#34D399'
                              : g.category === 'ROBOTICS'
                              ? '#38BDF8'
                              : g.category === 'FABRICATION'
                              ? '#FF9F1C'
                              : '#C084FC',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {g.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#E8EAF0', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{g.date}</div>
                      {g.location && <div style={{ fontSize: '11px', color: '#9AA3B5', whiteSpace: 'nowrap' }}>{g.location}</div>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {g.featured ? (
                        <span style={{ color: '#FF9F1C', fontSize: '11px', fontWeight: 700, border: '1px solid rgba(255, 159, 28, 0.3)', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255, 159, 28, 0.1)', whiteSpace: 'nowrap' }}>
                          ★ FEATURED
                        </span>
                      ) : (
                        <span style={{ color: '#64748B', fontSize: '11px' }}>Standard</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <QuickVisibilityToggle
                        isPublished={isActive}
                        label={isActive ? 'VISIBLE' : 'HIDDEN'}
                        onToggle={() => onToggleVisibility && g.id && onToggleVisibility(g.id, isActive)}
                      />
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => onEdit(g)}
                        style={{ background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}
                        title="Edit Photo"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => g.id && onDelete(g.id)}
                        style={{ background: 'none', border: '1px solid #232838', color: '#F87171', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete Photo"
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
    </div>
  );
}
