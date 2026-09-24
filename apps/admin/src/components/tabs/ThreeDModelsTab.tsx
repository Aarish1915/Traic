import { Box, ExternalLink, CheckCircle2, Copy, Check } from 'lucide-react';
import type { Project } from '@traic/shared';

interface ThreeDModelsTabProps {
  projects: Project[];
  copiedSlug: string | null;
  onCopyPath: (text: string, slug: string) => void;
  onEditProject: (project: Project) => void;
}

export function ThreeDModelsTab({ projects, copiedSlug, onCopyPath, onEditProject }: ThreeDModelsTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px' }}>
      {/* PROMINENT GUIDE CARD: Exact user requirements */}
      <div
        style={{
          backgroundColor: '#141821',
          border: '1px solid rgba(255, 159, 28, 0.4)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Box size={22} color="#FF9F1C" />
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#FF9F1C' }}>
            Add Your 3D — Real Hardware Showcase Pipeline
          </h2>
        </div>
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#9AA3B5', lineHeight: '1.6' }}>
          Follow this simple workflow to export real 3D models from your CAD/EDA software and link them to any project.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#0D0F14', border: '1px solid #232838', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#38BDF8', marginBottom: '6px' }}>
              1. From KiCad (PCBs):
            </div>
            <div style={{ fontSize: '12px', color: '#E8EAF0', lineHeight: '1.5' }}>
              Click <strong>File &gt; Export &gt; STEP</strong> (or VRML). In Blender, import it and click <strong>Export &gt; glTF 2.0 (.glb)</strong> with Draco compression enabled.
            </div>
          </div>

          <div style={{ backgroundColor: '#0D0F14', border: '1px solid #232838', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#34D399', marginBottom: '6px' }}>
              2. From CAD (Robots):
            </div>
            <div style={{ fontSize: '12px', color: '#E8EAF0', lineHeight: '1.5' }}>
              Export your assembly from <strong>Fusion 360, SolidWorks, or Onshape</strong> as <strong>.step</strong> or <strong>.obj</strong>, then convert to <strong>.glb</strong> in Blender.
            </div>
          </div>

          <div style={{ backgroundColor: '#0D0F14', border: '1px solid #232838', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#FF9F1C', marginBottom: '6px' }}>
              3. Place File:
            </div>
            <div style={{ fontSize: '12px', color: '#E8EAF0', lineHeight: '1.5' }}>
              Save your <code style={{ color: '#38BDF8' }}>.glb</code> inside <code style={{ color: '#38BDF8' }}>apps/web/public/models/</code> or upload to a CDN / GitHub release.
            </div>
          </div>

          <div style={{ backgroundColor: '#0D0F14', border: '1px solid #232838', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#A78BFA', marginBottom: '6px' }}>
              4. Set in Admin Panel:
            </div>
            <div style={{ fontSize: '12px', color: '#E8EAF0', lineHeight: '1.5' }}>
              In the table below, edit the project and paste the path (e.g. <code style={{ color: '#38BDF8' }}>/models/rover.glb</code>) into the <strong>3D Model Asset URL</strong> field!
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px', backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '8px', fontSize: '12px', color: '#34D399', fontWeight: 600 }}>
          ✓ The site will automatically load your real 3D model with full 360° rotation, zoom in/out, reset view, and wireframe inspection!
        </div>
      </div>

      {/* PROJECT 3D STATUS TABLE */}
      <div style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #232838', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Project 3D Models Status</h3>
          <a
            href="http://localhost:3000/projects"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}
          >
            <span>Open Public 3D Showcase</span>
            <ExternalLink size={13} />
          </a>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
              <th style={{ padding: '14px 16px' }}>Project</th>
              <th style={{ padding: '14px 16px' }}>Category</th>
              <th style={{ padding: '14px 16px' }}>Current 3D Viewport State</th>
              <th style={{ padding: '14px 16px' }}>Quick Copy Path</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id || p.slug} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{p.title}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9AA3B5' }}>{p.category}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {p.model3dAssetUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontWeight: 600, fontSize: '12px' }}>
                      <CheckCircle2 size={14} />
                      <span>Custom .glb: {p.model3dAssetUrl}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8', fontSize: '12px' }}>
                      <Box size={14} />
                      <span>Interactive Procedural CAD Board</span>
                    </div>
                  )}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button
                    onClick={() => onCopyPath(`/models/${p.slug}.glb`, p.slug)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#0D0F14',
                      border: '1px solid #232838',
                      color: '#9AA3B5',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedSlug === p.slug ? <Check size={12} color="#34D399" /> : <Copy size={12} />}
                    <span>/models/{p.slug}.glb</span>
                  </button>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => onEditProject(p)}
                    style={{
                      background: '#141821',
                      border: '1px solid #38BDF8',
                      color: '#38BDF8',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Edit 3D Model
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
