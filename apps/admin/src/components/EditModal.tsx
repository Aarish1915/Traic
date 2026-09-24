import { useState } from 'react';
import { X } from 'lucide-react';

interface EditModalProps {
  apiBase: string;
  type: string;
  initialData?: any;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function EditModal({
  apiBase,
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
      if (type === 'projects' && typeof payload.techStack === 'string') {
        payload.techStack = payload.techStack.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (type === 'projects') {
        payload.year = Number(payload.year) || 2024;
      }
      if (type === 'banners') {
        payload.priority = Number(payload.priority) || 1;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
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
        style={{
          backgroundColor: '#141821',
          border: '1px solid #232838',
          borderRadius: '16px',
          width: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
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
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>GitHub URL</label>
                  <input
                    type="url"
                    value={formData.repoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl || ''}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                  />
                </div>
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
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Venue *</label>
                <input
                  required
                  type="text"
                  value={formData.venue || ''}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#07080B', border: '1px solid #232838', color: '#E8EAF0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Registration URL</label>
                <input
                  type="url"
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
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: '1px solid #232838', color: '#9AA3B5', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#FF9F1C', color: '#07080B', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
