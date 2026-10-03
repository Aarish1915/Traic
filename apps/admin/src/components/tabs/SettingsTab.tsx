import type { SiteSetting } from '@traic/shared';

interface SettingsTabProps {
  settings: SiteSetting | null;
  setSettings: React.Dispatch<React.SetStateAction<SiteSetting | null>>;
  onSave: (settings: SiteSetting) => void;
}

export function SettingsTab({ settings, setSettings, onSave }: SettingsTabProps) {
  if (!settings) return null;

  return (
    <div style={{ maxWidth: '880px', backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', padding: '32px' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(settings);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
      >
        {/* Section 1: Brand & Identity */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#00E5FF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00E5FF' }} />
            1. Brand Identity & Creed Lockup
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                Club / Organization Name
              </label>
              <input
                type="text"
                value={settings.clubName || 'TRAIC'}
                onChange={(e) => setSettings({ ...settings, clubName: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                Brand Subtitle / Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                Official Motto / Creed
              </label>
              <input
                type="text"
                value={settings.mottoText || 'HONOR • HONESTY • SACRIFICE'}
                onChange={(e) => setSettings({ ...settings, mottoText: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#00E5FF', fontFamily: 'monospace', fontSize: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}>
              <input
                type="checkbox"
                id="showMotto"
                checked={settings.showMotto !== false}
                onChange={(e) => setSettings({ ...settings, showMotto: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#00E5FF', cursor: 'pointer' }}
              />
              <label htmlFor="showMotto" style={{ fontSize: '12px', color: '#E8EAF0', cursor: 'pointer' }}>
                Display Motto in Brand Sub-Label & Footer
              </label>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: '#232838', margin: 0 }} />

        {/* Section 2: Hero Section & Call to Actions */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
            2. Hero Section & Call-to-Actions (CTAs)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                Hero Main Headline
              </label>
              <input
                type="text"
                value={settings.heroHeadline || ''}
                onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                Hero Mission Statement / Subheadline
              </label>
              <textarea
                rows={3}
                value={settings.heroSubheadline || ''}
                onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px', lineHeight: 1.5 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                  Primary CTA Button Label
                </label>
                <input
                  type="text"
                  value={settings.heroPrimaryCtaText || 'Explore Projects'}
                  onChange={(e) => setSettings({ ...settings, heroPrimaryCtaText: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                  Primary CTA Destination URL
                </label>
                <input
                  type="text"
                  value={settings.heroPrimaryCtaUrl || '/projects'}
                  onChange={(e) => setSettings({ ...settings, heroPrimaryCtaUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                  Secondary CTA Button Label
                </label>
                <input
                  type="text"
                  value={settings.heroSecondaryCtaText || 'Join the 2025 Cohort'}
                  onChange={(e) => setSettings({ ...settings, heroSecondaryCtaText: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                  Secondary CTA Destination URL
                </label>
                <input
                  type="text"
                  value={settings.heroSecondaryCtaUrl || '/join'}
                  onChange={(e) => setSettings({ ...settings, heroSecondaryCtaUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: '#232838', margin: 0 }} />

        {/* Section 3: Metric Stat Counters (Numbers & Labels) */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34D399' }} />
            3. Dynamic Metric Counters (Values & Labels)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ backgroundColor: '#0D0F14', padding: '14px', borderRadius: '8px', border: '1px solid #232838' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Years</label>
                  <input
                    type="number"
                    value={settings.stats?.yearsActive ?? 5}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || {} as any), yearsActive: Number(e.target.value) },
                      })
                    }
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#141821', border: '1px solid #232838', color: '#00E5FF', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Label</label>
                  <input
                    type="text"
                    value={settings.stats?.yearsActiveLabel || 'Years of Engineering'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || {} as any), yearsActiveLabel: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#141821', border: '1px solid #232838', color: '#E8EAF0', fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#0D0F14', padding: '14px', borderRadius: '8px', border: '1px solid #232838' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Projects</label>
                  <input
                    type="number"
                    value={settings.stats?.projectsBuilt ?? 42}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || {} as any), projectsBuilt: Number(e.target.value) },
                      })
                    }
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#141821', border: '1px solid #232838', color: '#38BDF8', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Label</label>
                  <input
                    type="text"
                    value={settings.stats?.projectsBuiltLabel || 'Hardware & AI Projects'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || {} as any), projectsBuiltLabel: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#141821', border: '1px solid #232838', color: '#E8EAF0', fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#0D0F14', padding: '14px', borderRadius: '8px', border: '1px solid #232838' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Awards</label>
                  <input
                    type="number"
                    value={settings.stats?.awardsWon ?? 28}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || {} as any), awardsWon: Number(e.target.value) },
                      })
                    }
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#141821', border: '1px solid #232838', color: '#34D399', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Label</label>
                  <input
                    type="text"
                    value={settings.stats?.awardsWonLabel || 'National Awards Won'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || {} as any), awardsWonLabel: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#141821', border: '1px solid #232838', color: '#E8EAF0', fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#0D0F14', padding: '14px', borderRadius: '8px', border: '1px solid #232838' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Members</label>
                  <input
                    type="number"
                    value={settings.stats?.activeMembers ?? 95}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || {} as any), activeMembers: Number(e.target.value) },
                      })
                    }
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#141821', border: '1px solid #232838', color: '#F8FAFC', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Label</label>
                  <input
                    type="text"
                    value={settings.stats?.activeMembersLabel || 'Active Student Builders'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || {} as any), activeMembersLabel: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#141821', border: '1px solid #232838', color: '#E8EAF0', fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: '#232838', margin: 0 }} />

        {/* Section 4: Homepage Section Feature Toggles */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            4. Homepage Section Visibility Flags
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { id: 'showStats', label: 'Metric Stats Bar', key: 'showStats' },
              { id: 'showProjects', label: 'Featured 3D Projects', key: 'showProjects' },
              { id: 'showGear', label: 'Workshop Lab Equipment', key: 'showGear' },
              { id: 'showAchievements', label: 'Awards & Honors', key: 'showAchievements' },
              { id: 'showGallery', label: 'Field Dispatches / Media', key: 'showGallery' },
            ].map((toggle) => (
              <label
                key={toggle.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#0D0F14',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1px solid #232838',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#E8EAF0',
                }}
              >
                <input
                  type="checkbox"
                  checked={(settings.sectionToggles as any)?.[toggle.key] !== false}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sectionToggles: {
                        ...(settings.sectionToggles || { showStats: true, showProjects: true, showGear: true, showAchievements: true, showGallery: true }),
                        [toggle.key]: e.target.checked,
                      },
                    })
                  }
                  style={{ width: '16px', height: '16px', accentColor: '#00E5FF' }}
                />
                {toggle.label}
              </label>
            ))}
          </div>
        </div>

        <hr style={{ borderColor: '#232838', margin: 0 }} />

        {/* Section 5: Contact & Lab Location */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#A855F7', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A855F7' }} />
            5. Contact Information & Lab Facility
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                Contact / Lead Email
              </label>
              <input
                type="email"
                value={settings.contactEmail || 'traic@coer.ac.in'}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                Physical Lab Location
              </label>
              <input
                type="text"
                value={settings.labLocation || 'Advanced Robotics Lab, Block C-302, COER University'}
                onChange={(e) => setSettings({ ...settings, labLocation: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#00E5FF',
            color: '#030712',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '12px',
            transition: 'background-color 0.2s',
          }}
        >
          Save All Live Settings
        </button>
      </form>
    </div>
  );
}
