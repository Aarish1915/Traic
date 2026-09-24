import { useState } from 'react';
import { X } from 'lucide-react';

interface EditModalProps {
  apiBase: string;
  token?: string | null;
  type: string;
  initialData?: any;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function EditModal({
  apiBase,
  token,
  type,
  initialData,
  onClose,
  onSuccess,
}: EditModalProps) {
  const [formData, setFormData] = useState<any>(initialData || {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = Boolean(initialData?.id);
    const url = isEdit ? `${apiBase}/admin/${type}/${initialData.id}` : `${apiBase}/admin/${type}`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const payload = { ...formData };
      if (type === 'projects') {
        if (typeof payload.techStack === 'string') {
          payload.techStack = payload.techStack.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
        payload.year = Number(payload.year) || 2025;
        // Ensure descriptionMd exists (was previously 'description')
        if (!payload.descriptionMd && payload.description) {
          payload.descriptionMd = payload.description;
        }
        // Ensure demoUrl (was previously 'liveUrl')
        if (!payload.demoUrl && payload.liveUrl) {
          payload.demoUrl = payload.liveUrl;
        }
        if (payload.specs && Array.isArray(payload.specs)) {
          payload.specs = payload.specs.filter((s: any) => s.label && s.value);
        }
        if (payload.bom && Array.isArray(payload.bom)) {
          payload.bom = payload.bom.filter((b: any) => b.component && b.partNumber && b.function);
        }
        delete payload.description;
        delete payload.liveUrl;
      } else if (type === 'banners') {
        payload.priority = Number(payload.priority) || 1;
      } else if (type === 'members') {
        payload.order = Number(payload.order) || 0;
      } else if (type === 'alumni') {
        if (!payload.consentAt) {
          payload.consentAt = new Date().toISOString();
        }
      } else if (type === 'achievements') {
        if (!payload.date) {
          payload.date = new Date().toISOString().slice(0, 10);
        }
      } else if (type === 'events') {
        // Normalize startsAt: if user provided a date like "2025-03-15", convert to ISO string
        if (payload.startsAt && !payload.startsAt.includes('T')) {
          payload.startsAt = new Date(payload.startsAt).toISOString();
        }
        if (payload.endsAt && !payload.endsAt.includes('T') && payload.endsAt.length > 0) {
          payload.endsAt = new Date(payload.endsAt).toISOString();
        }
        if (!payload.startsAt) {
          payload.startsAt = new Date().toISOString();
        }
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        if (errData?.error?.details && typeof errData.error.details === 'object') {
          const detailMessages = Object.entries(errData.error.details)
            .map(([field, errs]: [string, any]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
            .join(' • ');
          throw new Error(detailMessages || errData?.error?.message || 'Operation failed');
        }
        throw new Error(errData?.error?.message || 'Operation failed');
      }

      const itemLabel = type === 'gallery' ? 'Gallery dispatch' : type.slice(0, -1);
      onSuccess(`${itemLabel} ${isEdit ? 'updated' : 'created'} successfully!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getTitle = () => {
    const isEdit = Boolean(initialData?.id);
    const label = type === 'gallery' ? 'Field Dispatch' : type.slice(0, -1);
    return `${isEdit ? 'Edit' : 'Create New'} ${label}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
      }}
    >
      <div
        className="edit-modal-box"
        style={{
          backgroundColor: '#141821',
          border: '1px solid #232838',
          borderRadius: '16px',
          width: '90vw',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'clamp(16px, 4vw, 28px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #232838', paddingBottom: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{getTitle()}</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#9AA3B5', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* GALLERY FORM */}
          {type === 'gallery' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Dispatch / Photo Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Smart India Hackathon 2024 Grand Finale Stage"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Image URL *</label>
                <input
                  required
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/... or /images/gallery/sih-stage.jpg"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
                {formData.imageUrl && (
                  <div style={{ marginTop: '8px', width: '100%', height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #232838', backgroundColor: '#000' }}>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Caption & Technical Context *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. TRAIC autonomous rover deployment at national hackathon finals after 36 hours of non-stop testing."
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Category *</label>
                  <select
                    value={formData.category || 'ROBOTICS'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  >
                    <option value="ROBOTICS">ROBOTICS</option>
                    <option value="FABRICATION">FABRICATION</option>
                    <option value="COMPETITION">COMPETITION</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="LAB_LIFE">LAB_LIFE</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Date (YYYY-MM-DD) *</label>
                  <input
                    required
                    type="text"
                    placeholder="2024-12-20"
                    value={formData.date || '2024-12-20'}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Location (e.g. Lab 402, SIH Stage)</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 402 - Robotics Bay"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Associated Project Slug (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. autonomous-rover-v2"
                    value={formData.projectSlug || ''}
                    onChange={(e) => setFormData({ ...formData, projectSlug: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#E8EAF0' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured === true}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Featured Dispatch (Highlight on Homepage and Top of Gallery)</span>
                </label>
              </div>
            </>
          )}

          {/* BANNERS FORM */}
          {type === 'banners' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Banner Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 2025 Cohort Announcement"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Banner Alert Message *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Applications for the 2025 cohort are officially open! Apply before the deadline."
                  value={formData.message || ''}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Banner Type *</label>
                  <select
                    value={formData.type || 'ANNOUNCEMENT'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  >
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT (Amber Sparkles)</option>
                    <option value="EVENT">EVENT (Cyan Calendar)</option>
                    <option value="URGENT">URGENT (Red Warning)</option>
                    <option value="ACHIEVEMENT">ACHIEVEMENT (Green Trophy)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Priority (1 = Highest)</label>
                  <input
                    type="number"
                    value={formData.priority || 1}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Link URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /join or /events"
                    value={formData.linkUrl || ''}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Link CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Apply Now"
                    value={formData.linkText || ''}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#E8EAF0' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active (Display immediately on website)</span>
                </label>
              </div>
            </>
          )}

          {/* PROJECTS FORM */}
          {type === 'projects' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Title *</label>
                <input
                  required
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Slug (lowercase, hyphens) *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. autonomous-rover-v2"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Tagline *</label>
                <input
                  required
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Category *</label>
                  <select
                    value={formData.category || 'HARDWARE'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  >
                    <option value="HARDWARE">HARDWARE</option>
                    <option value="SOFTWARE">SOFTWARE</option>
                    <option value="HYBRID">HYBRID</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Year *</label>
                  <input
                    required
                    type="number"
                    value={formData.year || 2024}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
              </div>

              {/* 3D Asset URL field */}
              <div style={{ padding: '12px', backgroundColor: '#0D0F14', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#38BDF8', fontWeight: 700, marginBottom: '4px' }}>
                  3D Model Asset URL (.glb file)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /models/rover.glb or https://.../board.glb"
                  value={formData.model3dAssetUrl || ''}
                  onChange={(e) => setFormData({ ...formData, model3dAssetUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
                <div style={{ fontSize: '11px', color: '#9AA3B5', marginTop: '4px' }}>
                  Place your file in <code>apps/web/public/models/</code> and reference it as <code>/models/filename.glb</code>.
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  placeholder="ROS2, C++, LiDAR, CAN Bus"
                  value={Array.isArray(formData.techStack) ? formData.techStack.join(', ') : formData.techStack || ''}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Description / Markdown *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe this project, its goals, hardware used, outcomes..."
                  value={formData.descriptionMd || ''}
                  onChange={(e) => setFormData({ ...formData, descriptionMd: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>GitHub Repo URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/TRAIC-community/..."
                    value={formData.repoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Live Demo / Video URL</label>
                  <input
                    type="text"
                    placeholder="https://demo.traic.in/... or YouTube link"
                    value={formData.demoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
              </div>

              {/* Publication Status & Featured */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Publication Status *</label>
                  <select
                    value={formData.status || 'DRAFT'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  >
                    <option value="DRAFT">DRAFT (Hidden from Public)</option>
                    <option value="PUBLISHED">PUBLISHED (Live on Public Website)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '18px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#E8EAF0' }}>
                    <input
                      type="checkbox"
                      checked={formData.featured === true}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>Featured Project (Top of Homepage)</span>
                  </label>
                </div>
              </div>

              {/* Hardware Specifications Builder */}
              <div style={{ padding: '14px', backgroundColor: '#0D0F14', border: '1px solid #232838', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8' }}>
                    Technical Specifications ({Array.isArray(formData.specs) ? formData.specs.length : 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = Array.isArray(formData.specs) ? [...formData.specs] : [];
                      setFormData({ ...formData, specs: [...cur, { label: '', value: '' }] });
                    }}
                    style={{ backgroundColor: '#1A2338', border: '1px solid #28344D', color: '#38BDF8', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    + Add Spec Row
                  </button>
                </div>
                {(formData.specs || []).length === 0 ? (
                  <div style={{ fontSize: '11px', color: '#64748B', fontStyle: 'italic' }}>
                    No custom hardware specifications added. Click &quot;+ Add Spec Row&quot; to configure.
                  </div>
                ) : (
                  (formData.specs || []).map((spec: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="Label (e.g. Battery System)"
                        value={spec.label || ''}
                        onChange={(e) => {
                          const specs = [...formData.specs];
                          specs[idx] = { ...specs[idx], label: e.target.value };
                          setFormData({ ...formData, specs });
                        }}
                        style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 6S 22.2V 10,000mAh LiFePO4)"
                        value={spec.value || ''}
                        onChange={(e) => {
                          const specs = [...formData.specs];
                          specs[idx] = { ...specs[idx], value: e.target.value };
                          setFormData({ ...formData, specs });
                        }}
                        style={{ flex: 2, padding: '6px 10px', borderRadius: '4px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0', fontSize: '12px' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const specs = formData.specs.filter((_: any, i: number) => i !== idx);
                          setFormData({ ...formData, specs });
                        }}
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '0 10px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Bill of Materials (BOM) Builder */}
              <div style={{ padding: '14px', backgroundColor: '#0D0F14', border: '1px solid #232838', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#FF9F1C' }}>
                    Bill of Materials (BOM) ({Array.isArray(formData.bom) ? formData.bom.length : 0} Components)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = Array.isArray(formData.bom) ? [...formData.bom] : [];
                      setFormData({ ...formData, bom: [...cur, { component: '', partNumber: '', function: '' }] });
                    }}
                    style={{ backgroundColor: '#1A2338', border: '1px solid #28344D', color: '#FF9F1C', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    + Add Part
                  </button>
                </div>
                {(formData.bom || []).length === 0 ? (
                  <div style={{ fontSize: '11px', color: '#64748B', fontStyle: 'italic' }}>
                    No BOM components added. Click &quot;+ Add Part&quot; to list silicon, sensors, and actuators.
                  </div>
                ) : (
                  (formData.bom || []).map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="Component Name"
                        value={item.component || ''}
                        onChange={(e) => {
                          const bom = [...formData.bom];
                          bom[idx] = { ...bom[idx], component: e.target.value };
                          setFormData({ ...formData, bom });
                        }}
                        style={{ padding: '6px 10px', borderRadius: '4px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        placeholder="Part Number"
                        value={item.partNumber || ''}
                        onChange={(e) => {
                          const bom = [...formData.bom];
                          bom[idx] = { ...bom[idx], partNumber: e.target.value };
                          setFormData({ ...formData, bom });
                        }}
                        style={{ padding: '6px 10px', borderRadius: '4px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        placeholder="Function in System"
                        value={item.function || ''}
                        onChange={(e) => {
                          const bom = [...formData.bom];
                          bom[idx] = { ...bom[idx], function: e.target.value };
                          setFormData({ ...formData, bom });
                        }}
                        style={{ padding: '6px 10px', borderRadius: '4px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0', fontSize: '12px' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const bom = formData.bom.filter((_: any, i: number) => i !== idx);
                          setFormData({ ...formData, bom });
                        }}
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '0 10px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* EVENTS FORM */}
          {type === 'events' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Event Title *</label>
                <input
                  required
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Slug *</label>
                <input
                  required
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Type *</label>
                  <select
                    value={formData.type || 'HACKATHON'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  >
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="EXPO">EXPO</option>
                    <option value="INTERNAL_BOOTCAMP">INTERNAL_BOOTCAMP</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Mode *</label>
                  <select
                    value={formData.mode || 'OFFLINE'}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  >
                    <option value="OFFLINE">OFFLINE</option>
                    <option value="ONLINE">ONLINE</option>
                    <option value="HYBRID">HYBRID</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Start Date & Time *</label>
                  <input
                    required
                    type="text"
                    placeholder="2025-03-15T09:00:00.000Z or 2025-03-15"
                    value={formData.startsAt || ''}
                    onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>End Date & Time (optional)</label>
                  <input
                    type="text"
                    placeholder="2025-03-16T18:00:00.000Z"
                    value={formData.endsAt || ''}
                    onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Venue *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. College Auditorium, Online - Google Meet"
                  value={formData.venue || ''}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Registration URL</label>
                <input
                  type="text"
                  placeholder="/join or https://forms.google.com/..."
                  value={formData.registerUrl || ''}
                  onChange={(e) => setFormData({ ...formData, registerUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.descriptionMd || ''}
                  onChange={(e) => setFormData({ ...formData, descriptionMd: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Publication Status *</label>
                <select
                  value={formData.status || 'PUBLISHED'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                >
                  <option value="PUBLISHED">PUBLISHED (Visible on Public Website)</option>
                  <option value="DRAFT">DRAFT (Hidden from Public Website)</option>
                </select>
              </div>
            </>
          )}

          {/* ACHIEVEMENTS FORM */}
          {type === 'achievements' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Title *</label>
                <input
                  required
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Event Name *</label>
                <input
                  required
                  type="text"
                  value={formData.eventName || ''}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Level *</label>
                  <select
                    value={formData.level || 'NATIONAL'}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  >
                    <option value="NATIONAL">NATIONAL</option>
                    <option value="INTERNATIONAL">INTERNATIONAL</option>
                    <option value="EXTERNAL">EXTERNAL</option>
                    <option value="INTERNAL">INTERNAL</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Rank / Honor *</label>
                  <input
                    required
                    type="text"
                    placeholder="1st Prize, AIR 4, Winner..."
                    value={formData.rank || ''}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Date (YYYY-MM-DD) *</label>
                <input
                  required
                  type="text"
                  placeholder="2024-12-20"
                  value={formData.date || '2024-12-20'}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Publication Status</label>
                <select
                  value={formData.status || 'PUBLISHED'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                >
                  <option value="PUBLISHED">PUBLISHED (Visible)</option>
                  <option value="DRAFT">DRAFT (Hidden)</option>
                </select>
              </div>
            </>
          )}

          {/* MEMBERS FORM */}
          {type === 'members' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Position *</label>
                  <select
                    value={formData.position || 'MEMBER'}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  >
                    <option value="COORDINATOR">COORDINATOR</option>
                    <option value="CO_COORDINATOR">CO_COORDINATOR</option>
                    <option value="LEAD">LEAD</option>
                    <option value="MEMBER">MEMBER</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Academic Year *</label>
                  <input
                    required
                    type="text"
                    placeholder="2024-2025"
                    value={formData.academicYear || '2024-2025'}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Bio</label>
                <textarea
                  rows={2}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Membership Status</label>
                <select
                  value={formData.status || 'PUBLISHED'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                >
                  <option value="PUBLISHED">PUBLISHED / ACTIVE (Visible on Team Page)</option>
                  <option value="DRAFT">DRAFT / HIDDEN (Hidden from Public)</option>
                </select>
              </div>
            </>
          )}

          {/* ALUMNI FORM */}
          {type === 'alumni' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Batch Year (YYYY) *</label>
                  <input
                    required
                    type="text"
                    placeholder="2023"
                    value={formData.batch || '2023'}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Company *</label>
                  <input
                    required
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Current Role *</label>
                <input
                  required
                  type="text"
                  value={formData.currentRole || ''}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Quote / Testimonial</label>
                <textarea
                  rows={2}
                  value={formData.quote || ''}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Alumni Profile Visibility</label>
                <select
                  value={formData.status || 'PUBLISHED'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                >
                  <option value="PUBLISHED">PUBLISHED (Visible in Alumni Network)</option>
                  <option value="DRAFT">DRAFT (Hidden from Public)</option>
                </select>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: '1px solid #232838', color: '#9AA3B5', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', flex: '1 1 auto', minWidth: '100px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#FF9F1C', color: '#07080B', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', flex: '2 1 auto', minWidth: '140px' }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
