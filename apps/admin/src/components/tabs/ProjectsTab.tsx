import { Edit2, Trash2 } from 'lucide-react';
import type { Project } from '@traic/shared';

interface ProjectsTabProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectsTab({ projects, onEdit, onDelete }: ProjectsTabProps) {
  return (
    <div style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
            <th style={{ padding: '14px 16px' }}>Project Title</th>
            <th style={{ padding: '14px 16px' }}>Category</th>
            <th style={{ padding: '14px 16px' }}>Year</th>
            <th style={{ padding: '14px 16px' }}>3D Asset</th>
            <th style={{ padding: '14px 16px' }}>Status</th>
            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id || p.slug} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
              <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                <div>{p.title}</div>
                <div style={{ fontSize: '11px', color: '#9AA3B5', marginTop: '2px' }}>{p.tagline}</div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    backgroundColor:
                      p.category === 'HARDWARE'
                        ? 'rgba(255, 159, 28, 0.15)'
                        : p.category === 'HYBRID'
                        ? 'rgba(56, 189, 248, 0.15)'
                        : 'rgba(52, 211, 153, 0.15)',
                    color:
                      p.category === 'HARDWARE'
                        ? '#FF9F1C'
                        : p.category === 'HYBRID'
                        ? '#38BDF8'
                        : '#34D399',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                  }}
                >
                  {p.category}
                </span>
              </td>
              <td style={{ padding: '14px 16px', fontFamily: 'monospace' }}>{p.year}</td>
              <td style={{ padding: '14px 16px' }}>
                {p.model3dAssetUrl ? (
                  <span style={{ color: '#34D399', fontSize: '11px', fontFamily: 'monospace' }}>.glb Attached</span>
                ) : (
                  <span style={{ color: '#9AA3B5', fontSize: '11px', fontFamily: 'monospace' }}>Procedural CAD</span>
                )}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: p.status === 'PUBLISHED' ? '#34D399' : '#FF9F1C' }}>
                  {p.status}
                </span>
              </td>
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <button
                  onClick={() => onEdit(p)}
                  style={{ background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => p.id && onDelete(p.id)}
                  style={{ background: 'none', border: '1px solid #232838', color: '#F87171', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <Trash2 size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
