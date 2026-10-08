import { Edit2, Trash2, Camera, Plus } from 'lucide-react';
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
          <Camera size={18} style={{ color: '#2997FF' }} />
          <span>
            <strong style={{ color: '#F5F5F7' }}>Field Dispatches & Photography:</strong> Manage high-resolution real hardware photos, arena competitions, and workshop activities.
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
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '44px',
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Add Field Photo</span>
        </button>
      </div>

      <div
        className="admin-table-wrap"
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
              <th style={{ padding: '16px 20px', width: '90px', fontWeight: 600, fontSize: '12px' }}>Media</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Title & Narrative</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Domain</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Location & Date</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Homepage</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gallery.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#8E8E93' }}>
                  <Camera size={32} style={{ margin: '0 auto 12px', opacity: 0.4, color: '#2997FF' }} />
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No gallery dispatches uploaded yet.</p>
                </td>
              </tr>
            ) : (
              gallery.map((item) => {
                const isFeatured = item.featured !== false;
                return (
                  <tr
                    key={item.id || item.title}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          backgroundColor: '#2C2C2E',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.currentTarget as any).src = '/traic-logo.png';
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '14px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#8E8E93', marginTop: '2px', maxWidth: '320px', lineHeight: 1.3 }}>
                        {item.caption}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          backgroundColor: 'rgba(0, 113, 227, 0.15)',
                          color: '#2997FF',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-family-mono)',
                          fontWeight: 700,
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#A1A1A6', fontSize: '12px' }}>
                      <div>{item.location || 'TRAIC Lab'}</div>
                      <div style={{ fontSize: '11px', color: '#8E8E93', fontFamily: '"JetBrains Mono", monospace', marginTop: '2px' }}>
                        {item.date}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <QuickVisibilityToggle
                        isPublished={isFeatured}
                        label={isFeatured ? 'FEATURED' : 'ARCHIVED'}
                        onToggle={() => onToggleVisibility && item.id && onToggleVisibility(item.id, isFeatured)}
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
                          title="Edit Photo"
                          aria-label="Edit Photo"
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
                          title="Delete Photo"
                          aria-label="Delete Photo"
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
    </div>
  );
}
