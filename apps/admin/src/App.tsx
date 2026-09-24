import { useState, useEffect } from 'react';
import type {
  Project,
  Event,
  Achievement,
  Member,
  Alumni,
  SiteSetting,
  JoinApplication,
  Banner,
  GalleryItem,
} from '@traic/shared';
import type { TabId } from './types';
import { Toast } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProjectsTab } from './components/tabs/ProjectsTab';
import { ThreeDModelsTab } from './components/tabs/ThreeDModelsTab';
import { BannersTab } from './components/tabs/BannersTab';
import { GalleryTab } from './components/tabs/GalleryTab';
import { EventsTab } from './components/tabs/EventsTab';
import { AchievementsTab } from './components/tabs/AchievementsTab';
import { MembersTab } from './components/tabs/MembersTab';
import { AlumniTab } from './components/tabs/AlumniTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { ApplicationsTab } from './components/tabs/ApplicationsTab';
import { EditModal } from './components/EditModal';

const API_BASE = 'http://localhost:4000';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('projects');

  // Live state
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [applications, setApplications] = useState<JoinApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modals state
  const [editingItem, setEditingItem] = useState<{ type: string; data?: any } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const copyToClipboard = (text: string, slug: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    showToast(`Copied ${text} to clipboard!`);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [projRes, evRes, achRes, memRes, alRes, banRes, galRes, setRes, appRes] = await Promise.all([
        fetch(`${API_BASE}/public/projects`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/public/events`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/public/achievements`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/public/team`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/public/alumni`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/admin/banners`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/admin/gallery`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/public/settings`).then((r) => r.json()).catch(() => ({ data: null })),
        fetch(`${API_BASE}/admin/applications`).then((r) => r.json()).catch(() => ({ data: [] })),
      ]);

      if (projRes.data) setProjects(projRes.data);
      if (evRes.data) setEvents(evRes.data);
      if (achRes.data) setAchievements(achRes.data);
      if (memRes.data) setMembers(memRes.data);
      if (alRes.data) setAlumni(alRes.data);
      if (banRes.data) setBanners(banRes.data);
      if (galRes.data) setGallery(galRes.data);
      if (setRes.data) setSettings(setRes.data);
      if (appRes.data) setApplications(appRes.data);
    } catch {
      showToast('Error connecting to backend API at http://localhost:4000', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/${type}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Deletion failed');
      const itemLabel = type === 'gallery' ? 'Gallery dispatch' : type.slice(0, -1);
      showToast(`${itemLabel} deleted successfully!`);
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleBanner = async (banner: Banner) => {
    if (!banner.id) return;
    try {
      const res = await fetch(`${API_BASE}/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      if (!res.ok) throw new Error('Failed to update banner status');
      showToast(`Banner "${banner.title}" is now ${!banner.isActive ? 'Active' : 'Paused'}`);
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveSettings = async (newSettings: SiteSetting) => {
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      showToast('Site settings updated live!');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#07080B', color: '#E8EAF0', fontFamily: 'system-ui, sans-serif' }}>
      <Toast toast={toast} />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          projects: projects.length,
          models3d: projects.filter((p) => !!p.model3dAssetUrl).length,
          banners: banners.length,
          gallery: gallery.length,
          events: events.length,
          achievements: achievements.length,
          members: members.length,
          alumni: alumni.length,
          applications: applications.length,
        }}
        loading={loading}
        onSync={fetchAllData}
      />

      <main style={{ flex: 1, padding: '36px 44px', overflowY: 'auto' }}>
        <Header activeTab={activeTab} onCreateNew={() => setEditingItem({ type: activeTab })} />

        {activeTab === 'projects' && (
          <ProjectsTab
            projects={projects}
            onEdit={(p) => setEditingItem({ type: 'projects', data: p })}
            onDelete={(id) => handleDelete('projects', id)}
          />
        )}

        {activeTab === '3d-models' && (
          <ThreeDModelsTab
            projects={projects}
            copiedSlug={copiedSlug}
            onCopyPath={copyToClipboard}
            onEditProject={(p) => setEditingItem({ type: 'projects', data: p })}
          />
        )}

        {activeTab === 'banners' && (
          <BannersTab
            banners={banners}
            onToggleBanner={handleToggleBanner}
            onEdit={(b) => setEditingItem({ type: 'banners', data: b })}
            onDelete={(id) => handleDelete('banners', id)}
            onCreate={() => setEditingItem({ type: 'banners' })}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryTab
            gallery={gallery}
            onEdit={(g) => setEditingItem({ type: 'gallery', data: g })}
            onDelete={(id) => handleDelete('gallery', id)}
            onCreate={() => setEditingItem({ type: 'gallery' })}
          />
        )}

        {activeTab === 'events' && (
          <EventsTab
            events={events}
            onEdit={(e) => setEditingItem({ type: 'events', data: e })}
            onDelete={(id) => handleDelete('events', id)}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsTab
            achievements={achievements}
            onEdit={(a) => setEditingItem({ type: 'achievements', data: a })}
            onDelete={(id) => handleDelete('achievements', id)}
          />
        )}

        {activeTab === 'members' && (
          <MembersTab
            members={members}
            onEdit={(m) => setEditingItem({ type: 'members', data: m })}
            onDelete={(id) => handleDelete('members', id)}
          />
        )}

        {activeTab === 'alumni' && (
          <AlumniTab
            alumni={alumni}
            onEdit={(al) => setEditingItem({ type: 'alumni', data: al })}
            onDelete={(id) => handleDelete('alumni', id)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            setSettings={setSettings}
            onSave={handleSaveSettings}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationsTab applications={applications} />
        )}
      </main>

      {editingItem && (
        <EditModal
          apiBase={API_BASE}
          type={editingItem.type}
          initialData={editingItem.data}
          onClose={() => setEditingItem(null)}
          onSuccess={(msg) => {
            setEditingItem(null);
            showToast(msg);
            fetchAllData();
          }}
        />
      )}
    </div>
  );
}
