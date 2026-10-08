import { useState } from 'react';
import type { SiteSetting } from '@traic/shared';
import { Save, CheckCircle2, Sliders, Hash, Globe, Eye, MapPin } from 'lucide-react';

interface SettingsTabProps {
  settings: SiteSetting | null;
  setSettings: React.Dispatch<React.SetStateAction<SiteSetting | null>>;
  onSave: (settings: SiteSetting) => void;
}

export function SettingsTab({ settings, setSettings, onSave }: SettingsTabProps) {
  const [savedRecently, setSavedRecently] = useState(false);

  if (!settings) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    setSavedRecently(true);
    setTimeout(() => setSavedRecently(false), 3000);
  };

  return (
    <div style={{ maxWidth: '940px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Section 1: Brand Identity & Academic Lab Creed */}
        <div
          style={{
            backgroundColor: '#1C1C1E',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 113, 227, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2997FF',
              }}
            >
              <Globe size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.01em' }}>
                1. Institutional Identity & Motto
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#8E8E93' }}>
                Official laboratory brand lockup and institutional creed
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                Organization / Club Name
              </label>
              <input
                type="text"
                value={settings.clubName || 'TRAIC'}
                onChange={(e) => setSettings({ ...settings, clubName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#F5F5F7',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                Brand Subtitle / Academic Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#F5F5F7',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                Official Motto / Creed
              </label>
              <input
                type="text"
                value={settings.mottoText || 'HONOR • HONESTY • SACRIFICE'}
                onChange={(e) => setSettings({ ...settings, mottoText: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#2997FF',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
              <input
                type="checkbox"
                id="showMotto"
                checked={settings.showMotto !== false}
                onChange={(e) => setSettings({ ...settings, showMotto: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#2997FF', cursor: 'pointer' }}
              />
              <label htmlFor="showMotto" style={{ fontSize: '13px', fontWeight: 500, color: '#F5F5F7', cursor: 'pointer' }}>
                Display Motto in Header & Footer Lockups
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Hero Section & Call to Actions */}
        <div
          style={{
            backgroundColor: '#1C1C1E',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 113, 227, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2997FF',
              }}
            >
              <Sliders size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.01em' }}>
                2. Apple Hero Typography & Direct CTAs
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#8E8E93' }}>
                Primary headline, mission narrative, and singular focal action buttons
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                Hero Main Headline (Displayed in SF Pro Display Bold)
              </label>
              <input
                type="text"
                value={settings.heroHeadline || ''}
                onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                placeholder="Where Hardware Meets Intelligent Code"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#F5F5F7',
                  fontSize: '14px',
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                Hero Mission Statement / Subtitle
              </label>
              <textarea
                rows={3}
                value={settings.heroSubheadline || ''}
                onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                placeholder="Designing custom PCBs, programming autonomous robots, and deploying edge AI systems."
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#F5F5F7',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                  Primary CTA Label (Action Pill)
                </label>
                <input
                  type="text"
                  value={settings.heroPrimaryCtaText || 'Explore Projects'}
                  onChange={(e) => setSettings({ ...settings, heroPrimaryCtaText: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#2C2C2E',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#F5F5F7',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                  Primary CTA Destination URL
                </label>
                <input
                  type="text"
                  value={settings.heroPrimaryCtaUrl || '/projects'}
                  onChange={(e) => setSettings({ ...settings, heroPrimaryCtaUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#2C2C2E',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#2997FF',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                  Secondary CTA Text Link
                </label>
                <input
                  type="text"
                  value={settings.heroSecondaryCtaText || 'Join the 2025 Cohort'}
                  onChange={(e) => setSettings({ ...settings, heroSecondaryCtaText: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#2C2C2E',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#F5F5F7',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                  Secondary CTA Destination URL
                </label>
                <input
                  type="text"
                  value={settings.heroSecondaryCtaUrl || '/join'}
                  onChange={(e) => setSettings({ ...settings, heroSecondaryCtaUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#2C2C2E',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#2997FF',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Metric Stat Counters (Numbers & Labels) */}
        <div
          style={{
            backgroundColor: '#1C1C1E',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(48, 209, 88, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#30D158',
              }}
            >
              <Hash size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.01em' }}>
                3. Dynamic Impact & Metric Benchmarks
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#8E8E93' }}>
                Real numbers and descriptive labels displayed across the public authority strip
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* Slot 1: Years */}
            <div
              style={{
                backgroundColor: '#2C2C2E',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8E8E93', marginBottom: '4px' }}>Years</label>
                  <input
                    type="number"
                    value={settings.stats?.yearsActive ?? 5}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || ({} as any)), yearsActive: Number(e.target.value) },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '8px',
                      backgroundColor: '#1C1C1E',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#2997FF',
                      fontWeight: 800,
                      fontFamily: '"JetBrains Mono", monospace',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8E8E93', marginBottom: '4px' }}>Custom Label</label>
                  <input
                    type="text"
                    value={settings.stats?.yearsActiveLabel || 'Years of Engineering'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || ({} as any)), yearsActiveLabel: e.target.value },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '8px',
                      backgroundColor: '#1C1C1E',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#F5F5F7',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Slot 2: Projects */}
            <div
              style={{
                backgroundColor: '#2C2C2E',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8E8E93', marginBottom: '4px' }}>Projects</label>
                  <input
                    type="number"
                    value={settings.stats?.projectsBuilt ?? 42}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || ({} as any)), projectsBuilt: Number(e.target.value) },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '8px',
                      backgroundColor: '#1C1C1E',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#2997FF',
                      fontWeight: 800,
                      fontFamily: '"JetBrains Mono", monospace',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8E8E93', marginBottom: '4px' }}>Custom Label</label>
                  <input
                    type="text"
                    value={settings.stats?.projectsBuiltLabel || 'Hardware & AI Projects'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || ({} as any)), projectsBuiltLabel: e.target.value },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '8px',
                      backgroundColor: '#1C1C1E',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#F5F5F7',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Slot 3: Awards */}
            <div
              style={{
                backgroundColor: '#2C2C2E',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8E8E93', marginBottom: '4px' }}>Awards</label>
                  <input
                    type="number"
                    value={settings.stats?.awardsWon ?? 28}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || ({} as any)), awardsWon: Number(e.target.value) },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '8px',
                      backgroundColor: '#1C1C1E',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#30D158',
                      fontWeight: 800,
                      fontFamily: '"JetBrains Mono", monospace',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8E8E93', marginBottom: '4px' }}>Custom Label</label>
                  <input
                    type="text"
                    value={settings.stats?.awardsWonLabel || 'National Awards Won'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || ({} as any)), awardsWonLabel: e.target.value },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '8px',
                      backgroundColor: '#1C1C1E',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#F5F5F7',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Slot 4: Members */}
            <div
              style={{
                backgroundColor: '#2C2C2E',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8E8E93', marginBottom: '4px' }}>Members</label>
                  <input
                    type="number"
                    value={settings.stats?.activeMembers ?? 95}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || ({} as any)), activeMembers: Number(e.target.value) },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '8px',
                      backgroundColor: '#1C1C1E',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#F5F5F7',
                      fontWeight: 800,
                      fontFamily: '"JetBrains Mono", monospace',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8E8E93', marginBottom: '4px' }}>Custom Label</label>
                  <input
                    type="text"
                    value={settings.stats?.activeMembersLabel || 'Active Student Builders'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stats: { ...(settings.stats || ({} as any)), activeMembersLabel: e.target.value },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '8px',
                      backgroundColor: '#1C1C1E',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#F5F5F7',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Homepage Section Feature Toggles */}
        <div
          style={{
            backgroundColor: '#1C1C1E',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 159, 10, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF9F0A',
              }}
            >
              <Eye size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.01em' }}>
                4. Homepage Chapter Visibility Flags
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#8E8E93' }}>
                Instantly turn on or off any chapter or section on the live homepage
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { id: 'showStats', label: 'Metric Benchmarks Bar', key: 'showStats' },
              { id: 'showProjects', label: 'Flagship Projects', key: 'showProjects' },
              { id: 'showGear', label: 'Workshop & Lab Gear', key: 'showGear' },
              { id: 'showAchievements', label: 'National Honors & Laurels', key: 'showAchievements' },
              { id: 'showGallery', label: 'Field Media & Dispatches', key: 'showGallery' },
            ].map((toggle) => (
              <label
                key={toggle.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#2C2C2E',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#F5F5F7',
                  minHeight: '44px',
                  boxSizing: 'border-box',
                }}
              >
                <input
                  type="checkbox"
                  checked={(settings.sectionToggles as any)?.[toggle.key] !== false}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sectionToggles: {
                        ...(settings.sectionToggles || {
                          showStats: true,
                          showProjects: true,
                          showGear: true,
                          showAchievements: true,
                          showGallery: true,
                        }),
                        [toggle.key]: e.target.checked,
                      },
                    })
                  }
                  style={{ width: '18px', height: '18px', accentColor: '#2997FF', cursor: 'pointer' }}
                />
                {toggle.label}
              </label>
            ))}
          </div>
        </div>

        {/* Section 5: Contact & Lab Facility */}
        <div
          style={{
            backgroundColor: '#1C1C1E',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(191, 90, 242, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#BF5AF2',
              }}
            >
              <MapPin size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.01em' }}>
                5. Laboratory Facility & Coordination Contact
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#8E8E93' }}>
                Official correspondence email and physical university workshop coordinates
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                Contact / Admissions Email
              </label>
              <input
                type="email"
                value={settings.contactEmail || 'traic@coer.ac.in'}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#F5F5F7',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A1A1A6', marginBottom: '6px' }}>
                Physical Lab Facility Address
              </label>
              <input
                type="text"
                value={settings.labLocation || 'Advanced Robotics Lab, Block C-302, COER University'}
                onChange={(e) => setSettings({ ...settings, labLocation: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#F5F5F7',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '8px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#0071E3',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(0, 113, 227, 0.3)',
              minHeight: '44px',
              transition: 'transform 0.15s ease',
            }}
          >
            <Save size={16} strokeWidth={2.5} />
            <span>Publish Settings to Live Website</span>
          </button>

          {savedRecently && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#30D158', fontSize: '13px', fontWeight: 600 }}>
              <CheckCircle2 size={16} />
              <span>Published to in-memory cache & Neon PostgreSQL!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
