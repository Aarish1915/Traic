import Link from 'next/link';
import { ArrowRight, Trophy, Medal } from 'lucide-react';
import { SpotlightCard } from '@/components/SpotlightCard';

export const metadata = {
  title: 'National Track Record & IP Honors — TRAIC',
  description: 'Smart India Hackathon 1st Prize, DD Robocon AIR 4, Indian Patent Office filings, and competitive engineering laurels.',
};

export const revalidate = 60; // ISR cache

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface AchievementRecord {
  id?: string;
  title: string;
  eventName: string;
  level: string;
  rank?: string;
  date?: string;
  year?: string | number;
  description: string;
  certificateAssetUrl?: string;
}

const DEFAULT_ACHIEVEMENTS: AchievementRecord[] = [
  {
    title: 'Smart India Hackathon 2024 — 1st Prize Champions',
    eventName: 'Smart India Hackathon (Hardware Edition)',
    level: 'NATIONAL',
    rank: 'Winner (1st of 2,400+ Teams)',
    year: '2024',
    description: 'Awarded 1st prize by Ministry of Education & AICTE for building an autonomous amphibious pipeline inspection robot featuring real-time acoustic crack detection.',
  },
  {
    title: 'DD Robocon 2024 — All-India Rank 4',
    eventName: 'Doordarshan National Robocon',
    level: 'NATIONAL',
    rank: 'AIR 4 & Best Mechanical Design',
    year: '2024',
    description: 'Constructed custom dual-flywheel ball-launching mobile robot achieving sub-0.1mm repeatability during the national championship tournament.',
  },
  {
    title: 'Patent Filed — Indian Patent Office Docket No. 2024110892',
    eventName: 'Intellectual Property Office, Govt. of India',
    level: 'PATENT',
    rank: 'Patent Application Published',
    year: '2024',
    description: 'Official patent titled "Distributed Fault-Tolerant CAN-FD Communication Bus for Multi-Rotor UAV Safety Interlocks".',
  },
  {
    title: 'IIT Bombay Techfest Autonomous Challenge — 2nd Prize',
    eventName: 'IIT Bombay Techfest',
    level: 'EXTERNAL',
    rank: '2nd Place',
    year: '2023',
    description: 'Autonomous indoor obstacle navigation utilizing custom LiDAR SLAM and real-time path replanning algorithms.',
  },
  {
    title: 'Uttarakhand State Innovation Conclave — Gold Medal',
    eventName: 'UCOST State Science & Technology Congress',
    level: 'REGIONAL',
    rank: '1st Prize / Gold',
    year: '2023',
    description: 'Recognized for indigenous low-cost agricultural sensor nodes with LoRaWAN mesh communication.',
  },
  {
    title: 'COER University Annual Technical Excellence Award',
    eventName: 'COER Foundation Day',
    level: 'INTERNAL',
    rank: 'Best Student Innovation Unit',
    year: '2024',
    description: 'Highest university distinction honoring exceptional research publication output and national competition representation.',
  },
];

export default async function AchievementsPage() {
  let achievements = DEFAULT_ACHIEVEMENTS;

  try {
    const res = await fetch(`${API_BASE}/public/achievements`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        achievements = json.data.map((a: any) => ({
          title: a.title || a.awardTitle,
          eventName: a.eventName || a.event,
          level: a.level || 'NATIONAL',
          rank: a.rank,
          year: a.year ? String(a.year) : '2024',
          description: a.descriptionMd || a.description,
          certificateAssetUrl: a.certificateAssetUrl,
        }));
      }
    }
  } catch (err) {
    // Fall back to default
  }

  const companies = ['Texas Instruments', 'Qualcomm', 'Bosch Engineering', 'ISRO', 'NVIDIA'];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4 selection:bg-neutral-700 selection:text-white">
      <div className="w-full max-w-apple mx-auto">
        {/* Section 1: Hero */}
        <div className="text-center max-w-[820px] mx-auto mb-20">
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold">
            NATIONAL TRACK RECORD &amp; IP
          </span>
          <h1 className="text-[38px] sm:text-[54px] font-display font-extrabold tracking-[-0.035em] text-ink-primary mt-2 leading-[1.08]">
            We compete. We win. We file patents.
          </h1>
          <p className="mt-4 text-[17px] sm:text-[19px] text-ink-secondary leading-relaxed max-w-[720px] mx-auto">
            Our teams represent COER University at India's highest collegiate engineering stages. We do not participate for participation certificates — we build to set the national benchmark.
          </p>
        </div>

        {/* Section 2: Top 3 Awards Asymmetric Bento */}
        <div className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Big Award Card: SIH 2024 (7 Cols) */}
            <SpotlightCard className="lg:col-span-7 p-8 sm:p-12 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span className="px-3 py-1 rounded-pill bg-canvas border border-subtle text-ink-primary text-[11px] font-mono font-bold uppercase tracking-wider">
                    1ST PLACE NATIONAL CHAMPIONS
                  </span>
                  <span className="text-[12px] font-mono text-ink-tertiary">2024</span>
                </div>
                <h2 className="text-[28px] sm:text-[34px] font-display font-bold text-ink-primary leading-tight">
                  Smart India Hackathon 2024
                </h2>
                <p className="text-[13.5px] font-mono text-ink-secondary mt-1 font-medium">
                  Ministry of Education &amp; AICTE Hardware Edition
                </p>
                <p className="mt-6 text-[15.5px] text-ink-secondary leading-relaxed">
                  Competed against 2,400+ national universities in the Hardware Grand Finale. Fabricated an autonomous pipeline inspection crawler inside the 36-hour live sprint with operational ultrasonic sensor thickness scanning and CAN-FD telemetry.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-subtle flex flex-wrap items-center justify-between gap-4 text-[13px]">
                <div className="flex items-center gap-2 text-ink-primary font-mono font-medium">
                  <Trophy className="h-4 w-4 text-ink-primary" />
                  <span>Prize: ₹1,00,000 + Incubation Grant</span>
                </div>
                <span className="text-ink-tertiary font-mono">Status: Verified</span>
              </div>
            </SpotlightCard>

            {/* Right Column: 2 Cards (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Robocon Card */}
              <SpotlightCard className="p-8 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-pill bg-canvas border border-subtle text-[10.5px] font-mono text-ink-primary font-bold uppercase">
                      ALL-INDIA RANK 4
                    </span>
                    <span className="text-[11px] font-mono text-ink-tertiary">2024</span>
                  </div>
                  <h3 className="text-[20px] font-display font-bold text-ink-primary">
                    DD Robocon India National Finals
                  </h3>
                  <p className="text-[12px] font-mono text-ink-tertiary mt-0.5">Doordarshan &amp; IIT Delhi</p>
                  <p className="mt-3 text-[14px] text-ink-secondary leading-relaxed">
                    Designed high-power brushless flywheel shooting system with closed-loop PID control and sub-0.1mm launch trajectory repeatability.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-subtle text-[11px] font-mono text-ink-secondary">
                  Awarded Best Mechanical System Architecture
                </div>
              </SpotlightCard>

              {/* Patent Card */}
              <SpotlightCard className="p-8 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-pill bg-canvas border border-subtle text-[10.5px] font-mono text-ink-primary font-bold uppercase">
                      PATENT FILED
                    </span>
                    <span className="text-[11px] font-mono text-ink-tertiary">2024</span>
                  </div>
                  <h3 className="text-[20px] font-display font-bold text-ink-primary">
                    IPO Docket No. 2024110892
                  </h3>
                  <p className="text-[12px] font-mono text-ink-tertiary mt-0.5">Indian Patent Office, New Delhi</p>
                  <p className="mt-3 text-[14px] text-ink-secondary leading-relaxed">
                    &ldquo;Distributed Fault-Tolerant CAN-FD Communication Bus for Multi-Rotor UAV Safety Interlocks&rdquo;.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-subtle text-[11px] font-mono text-ink-secondary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-primary/70" />
                  <span>Official Application Published</span>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>

        {/* Section 3: All Achievements Grid */}
        <div className="mb-24">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold">
              HONORS DIRECTORY
            </span>
            <h2 className="text-[28px] font-display font-bold text-ink-primary mt-1 tracking-tight">
              All Laurels &amp; Recognitions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((item, idx) => (
              <SpotlightCard
                key={`${item.title}-${idx}`}
                className="p-6 rounded-3xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10.5px] font-mono text-ink-tertiary uppercase font-bold tracking-wider">
                      {item.level}
                    </span>
                    <span className="text-[11px] font-mono text-ink-tertiary">{item.year}</span>
                  </div>

                  <h3 className="text-[18px] font-display font-bold text-ink-primary leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-[13px] font-medium text-ink-secondary mt-1">
                    {item.eventName}
                  </p>

                  <p className="mt-3 text-[14px] text-ink-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.rank && (
                  <div className="mt-6 pt-4 border-t border-subtle flex items-center gap-2 text-[12px] font-mono text-ink-secondary">
                    <Medal className="h-3.5 w-3.5 text-ink-tertiary" />
                    <span>{item.rank}</span>
                  </div>
                )}
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Section 4: Alumni Placement Strip */}
        <SpotlightCard className="mb-20 p-8 rounded-3xl text-center">
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-tertiary font-bold block mb-4">
            WHERE OUR CHAMPIONSHIP BUILDERS WORK TODAY
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 font-display font-bold text-[16px] sm:text-[18px] text-ink-primary">
            {companies.map((c) => (
              <span key={c} className="hover:text-ink-primary transition-colors">{c}</span>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/alumni" className="text-[13.5px] font-medium text-apple-blue hover:underline inline-flex items-center gap-1 min-h-[44px]">
              <span>View full Alumni Network</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
