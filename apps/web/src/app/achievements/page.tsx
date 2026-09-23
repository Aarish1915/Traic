import { Trophy, Award, Medal, Calendar } from 'lucide-react';

const ACHIEVEMENTS = [
  {
    title: 'National Champions — Hardware Edition',
    eventName: 'Smart India Hackathon (SIH 2024)',
    level: 'NATIONAL',
    rank: '1st Prize / Grand Winners',
    date: 'December 2024',
    summary: 'Built an autonomous inspection crawler robot designed for hazardous industrial pipelines. Evaluated on hardware ruggedness, live telemetry, and real-time defect classification.',
    highlights: ['₹1,00,000 Cash Prize', 'Selected by Ministry of Power', 'Live demo with 0 communication dropouts'],
  },
  {
    title: 'AIR 4 & Best Engineering Design Trophy',
    eventName: 'DD Robocon India National Finals',
    level: 'NATIONAL',
    rank: 'All India Rank 4',
    date: 'June 2024',
    summary: 'Designed two co-operating holonomic robots with pneumatic ball launchers and sub-millimeter optical positioning system under stringent weight and dimension constraints.',
    highlights: ['Best Engineering Design Trophy', 'Top 4 out of 110+ college teams', 'Fastest autonomous task completion time'],
  },
  {
    title: '1st Runners-Up: Autonomous Robotics Track',
    eventName: 'IIT Bombay Techfest Autonomous Challenge',
    level: 'NATIONAL',
    rank: '2nd Prize',
    date: 'December 2023',
    summary: 'Autonomous obstacle traversal and real-time optical target classification on an NVIDIA Jetson platform with custom stereo-vision depth extraction.',
    highlights: ['Silver Medalist', 'Top score in obstacle navigation precision'],
  },
  {
    title: 'Winners: Edge AI & Embedded Systems Track',
    eventName: 'IEEE Hardware Sprint',
    level: 'EXTERNAL',
    rank: '1st Place',
    date: 'October 2023',
    summary: 'Quantized neural accelerator on STM32 microcontroller executing human-presence detection at under 15mW power envelope.',
    highlights: ['Best Low-Power Design Award', 'Selected for IEEE Student Paper publication'],
  },
  {
    title: 'Best Hardware Prototype Award',
    eventName: 'National Innovation Fair (NIF)',
    level: 'NATIONAL',
    rank: 'Special Innovation Award',
    date: 'March 2023',
    summary: 'Multi-parameter industrial IoT telemetry node with failover mesh radio network for remote agricultural sensor clusters.',
    highlights: ['Exhibited at National Science Center', 'Prototype adoption grant awarded'],
  },
];

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-bg-0 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-accent">
            <Trophy className="h-3.5 w-3.5" />
            <span>HONORS // COMPETITIVE RECORD</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-text-1">
            Achievements & Awards
          </h1>
          <p className="mt-3 text-base text-text-2 leading-relaxed">
            Every year, TRAIC teams enter competitive arenas against premier engineering institutions across India. Here is the physical proof of our engineering rigor.
          </p>
        </div>

        {/* Timeline of Achievements */}
        <div className="space-y-6">
          {ACHIEVEMENTS.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-surface/70 p-6 md:p-8 transition-all hover:border-accent/40 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 text-accent">
                    {idx === 0 ? <Trophy className="h-5 w-5" /> : <Award className="h-5 w-5" />}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                      {item.rank}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-text-1">
                      {item.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-text-2">
                  <span className="rounded bg-bg-1 px-2.5 py-1 border border-border font-semibold text-accent-2">
                    {item.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.date}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-text-1 mb-2">
                Event: <span className="text-accent-2">{item.eventName}</span>
              </p>
              <p className="text-sm text-text-2 leading-relaxed max-w-4xl">
                {item.summary}
              </p>

              {/* Highlights */}
              <div className="mt-5 flex flex-wrap gap-2">
                {item.highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1.5 rounded-md bg-bg-0 px-3 py-1 text-xs font-mono text-text-1 border border-border"
                  >
                    <Medal className="h-3 w-3 text-accent" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
