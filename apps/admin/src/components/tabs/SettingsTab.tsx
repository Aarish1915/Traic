import type { SiteSetting } from '@traic/shared';

interface SettingsTabProps {
  settings: SiteSetting | null;
  setSettings: React.Dispatch<React.SetStateAction<SiteSetting | null>>;
  onSave: (settings: SiteSetting) => void;
}

export function SettingsTab({ settings, setSettings, onSave }: SettingsTabProps) {
  if (!settings) return null;

  return (
    <div style={{ maxWidth: '800px', backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', padding: '32px' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(settings);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Hero Headlines */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#9AA3B5', marginBottom: '4px' }}>
            Hero Headline
          </label>
          <input
            type="text"
            value={settings.heroHeadline}
            onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#9AA3B5', marginBottom: '4px' }}>
            Hero Subheadline
          </label>
          <textarea
            rows={3}
            value={settings.heroSubheadline}
            onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontSize: '13px' }}
          />
        </div>

        {/* Stat Counters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Years Active</label>
            <input
              type="number"
              value={settings.stats?.yearsActive || 5}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  stats: { ...(settings.stats || { projectsBuilt: 42, awardsWon: 28, activeMembers: 95 }), yearsActive: Number(e.target.value) },
                })
              }
              style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#00E5FF', fontWeight: 800 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Projects Built</label>
            <input
              type="number"
              value={settings.stats?.projectsBuilt || 42}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  stats: { ...(settings.stats || { yearsActive: 5, awardsWon: 28, activeMembers: 95 }), projectsBuilt: Number(e.target.value) },
                })
              }
              style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#38BDF8', fontWeight: 800 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Awards Won</label>
            <input
              type="number"
              value={settings.stats?.awardsWon || 28}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  stats: { ...(settings.stats || { yearsActive: 5, projectsBuilt: 42, activeMembers: 95 }), awardsWon: Number(e.target.value) },
                })
              }
              style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#34D399', fontWeight: 800 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>Active Members</label>
            <input
              type="number"
              value={settings.stats?.activeMembers || 95}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  stats: { ...(settings.stats || { yearsActive: 5, projectsBuilt: 42, awardsWon: 28 }), activeMembers: Number(e.target.value) },
                })
              }
              style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0D0F14', border: '1px solid #232838', color: '#E8EAF0', fontWeight: 800 }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#FF9F1C',
            color: '#07080B',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Save Live Settings
        </button>
      </form>
    </div>
  );
}
