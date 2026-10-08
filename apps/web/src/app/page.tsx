import { ClientHome, ProjectItem, GearItem, EventItem } from './ClientHome';

export const revalidate = 60; // ISR cache

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export default async function HomePage() {
  const [settingsRaw, projectsRaw, gearRaw, _achievementsRaw, eventsRaw] = await Promise.all([
    fetchAPI('/public/settings'),
    fetchAPI('/public/projects'),
    fetchAPI('/public/gear'),
    fetchAPI('/public/achievements'),
    fetchAPI('/public/events'),
  ]);

  let heroHeadline = 'We build the machines that think in the real world.';
  let heroSubheadline =
    'A collegiate engineering community mastering custom circuit boards, autonomous robotics, and self-hosted Linux infrastructure — from the ground up.';

  let stats = [
    { value: '5+', label: 'Years of Engineering' },
    { value: '42+', label: 'Hardware & AI Projects' },
    { value: '28+', label: 'National Awards Won' },
    { value: '95+', label: 'Active Student Builders' },
  ];

  if (settingsRaw) {
    if (settingsRaw.heroHeadline) heroHeadline = settingsRaw.heroHeadline;
    if (settingsRaw.heroSubheadline) heroSubheadline = settingsRaw.heroSubheadline;
    if (settingsRaw.stats) {
      stats = [
        {
          value: `${settingsRaw.stats.yearsActive ?? '5'}+`,
          label: settingsRaw.stats.yearsActiveLabel || 'Years of Engineering',
        },
        {
          value: `${settingsRaw.stats.projectsBuilt ?? settingsRaw.stats.projectsCount ?? '42'}+`,
          label: settingsRaw.stats.projectsBuiltLabel || 'Hardware & AI Projects',
        },
        {
          value: `${settingsRaw.stats.awardsWon ?? settingsRaw.stats.awardsCount ?? '28'}+`,
          label: settingsRaw.stats.awardsWonLabel || 'National Honors Won',
        },
        {
          value: `${settingsRaw.stats.activeMembers ?? settingsRaw.stats.buildersCount ?? '95'}+`,
          label: settingsRaw.stats.activeMembersLabel || 'Active Student Builders',
        },
      ];
    }
  }

  const projects: ProjectItem[] = (projectsRaw || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    tagline: p.tagline,
    category: p.category,
    tech: p.techStack || p.tech || [],
    status: p.status,
    description: p.descriptionMd || p.description,
    specs: p.specs,
    bom: p.bom,
  }));

  const gear: GearItem[] = (gearRaw || []).map((g: any) => ({
    id: g.id,
    name: g.name,
    model: g.model,
    category: g.category,
    status: g.status,
    specifications: g.specifications,
  }));

  const events: EventItem[] = (eventsRaw || []).map((e: any) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    tagline: e.tagline,
    type: e.type,
    mode: e.mode,
    venue: e.venue,
    startsAt: e.startsAt,
  }));

  return (
    <ClientHome
      heroHeadline={heroHeadline}
      heroSubheadline={heroSubheadline}
      stats={stats}
      projects={projects}
      gear={gear}
      events={events}
    />
  );
}
