import { Edit2, Trash2, Cpu } from 'lucide-react';
import type { Project } from '@traic/shared';
import { QuickVisibilityToggle } from '../QuickVisibilityToggle';

interface ProjectsTabProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onToggleVisibility?: (id: string, currentStatus: string) => void;
}

export function ProjectsTab({ projects, onEdit, onDelete, onToggleVisibility }: ProjectsTabProps) {
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
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Flagship Title &amp; Specs</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Domain</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Silicon BOM</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Tech Stack</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px' }}>Status</th>
            <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const isPublished = p.status === 'PUBLISHED';
            return (
              <tr
                key={p.id || p.slug}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 700, color: '#F5F5F7', fontSize: '14px' }}>{p.title}</div>
                  <div style={{ fontSize: '12px', color: '#8E8E93', marginTop: '2px', lineHeight: 1.3 }}>{p.tagline}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span
                    style={{
                      backgroundColor:
                        p.category === 'HARDWARE'
                          ? 'rgba(0, 113, 227, 0.15)'
                          : p.category === 'HYBRID'
                          ? 'rgba(191, 90, 242, 0.12)'
                          : 'rgba(48, 209, 88, 0.12)',
                      color:
                        p.category === 'HARDWARE'
                          ? '#2997FF'
                          : p.category === 'HYBRID'
                          ? '#BF5AF2'
                          : '#30D158',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontFamily: '"SF Mono", monospace',
                      fontWeight: 700,
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    {p.category}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#A1A1A6' }}>
                    <Cpu size={14} style={{ color: '#2997FF' }} />
                    <span>{Array.isArray(p.bom) ? `${p.bom.length} ICs` : 'Validated BOM'}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                    {p.techStack && p.techStack.length > 0 ? (
                      p.techStack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '10.5px',
                            fontFamily: '"SF Mono", monospace',
                            color: '#8E8E93',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: '#8E8E93', fontSize: '11px', fontFamily: '"SF Mono", monospace' }}>
                        Production Grade
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <QuickVisibilityToggle
                    isPublished={isPublished}
                    onToggle={() => onToggleVisibility && p.id && onToggleVisibility(p.id, p.status || 'DRAFT')}
                  />
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => onEdit(p)}
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
                        transition: 'background-color 0.15s ease',
                      }}
                      title="Edit Project"
                      aria-label="Edit Project"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => p.id && onDelete(p.id)}
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
                        transition: 'background-color 0.15s ease',
                      }}
                      title="Delete Project"
                      aria-label="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

      {/* Mobile Card List (< 768px) - Apple Inset Grouped */}
      <div className="admin-mobile-card-list">
        {projects.map((p) => {
          const isPublished = p.status === 'PUBLISHED';
          return (
            <div
              key={p.id || p.slug}
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
                  {p.title}
                </div>
                <span
                  style={{
                    backgroundColor:
                      p.category === 'HARDWARE'
                        ? 'rgba(0, 113, 227, 0.15)'
                        : p.category === 'HYBRID'
                        ? 'rgba(191, 90, 242, 0.12)'
                        : 'rgba(48, 209, 88, 0.12)',
                    color:
                      p.category === 'HARDWARE'
                        ? '#2997FF'
                        : p.category === 'HYBRID'
                        ? '#BF5AF2'
                        : '#30D158',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-family-mono, monospace)',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {p.category}
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: '#8E8E93', lineHeight: 1.4 }}>
                {p.tagline}
              </div>

              {p.techStack && p.techStack.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {p.techStack.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-family-mono, monospace)',
                        color: '#8E8E93',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
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
                    onToggle={() => onToggleVisibility && p.id && onToggleVisibility(p.id, p.status || 'DRAFT')}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
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
                    title="Edit Project"
                    aria-label="Edit Project"
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => p.id && onDelete(p.id)}
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
                    title="Delete Project"
                    aria-label="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
