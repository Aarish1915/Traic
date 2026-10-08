import Link from 'next/link';
import { Briefcase, ExternalLink, Quote } from 'lucide-react';

export const metadata = {
  title: 'Alumni Network — TRAIC Builders at the Frontier',
  description: 'Where TRAIC graduates build today: Texas Instruments, Qualcomm, Bosch, ISRO, NVIDIA, and top deep-tech startups.',
};

export const revalidate = 60; // ISR

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface AlumniRecord {
  id?: string;
  name: string;
  batch: string;
  role: string;
  company: string;
  legacyProject?: string;
  quote?: string;
  photoUrl?: string;
  linkedin?: string;
}

const DEFAULT_ALUMNI: AlumniRecord[] = [
  {
    name: 'Siddharth Saxena',
    batch: 'Class of 2023',
    role: 'Embedded Hardware Engineer',
    company: 'Texas Instruments',
    legacyProject: 'Quadruped Robot Dynamic Gaits',
    quote: 'At TRAIC, understanding the silicon datasheet was not optional. That rigor was what separated me during my TI analog and MCU technical rounds.',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Neha Negi',
    batch: 'Class of 2023',
    role: 'Robotics Perception Specialist',
    company: 'Qualcomm Technologies',
    legacyProject: 'Autonomous Guided Vehicle SLAM',
    quote: 'Deploying real-time TensorRT models on embedded Snapdragon boards in college gave me a 2-year headstart in industry.',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Arjun Singhal',
    batch: 'Class of 2024',
    role: 'Automotive Firmware Engineer',
    company: 'Bosch Engineering',
    legacyProject: 'Distributed CAN-FD ECU Network',
    quote: 'Wiring CAN-FD transceivers and debugging packet errors with a Saleae logic analyzer at 2 AM prepared me for automotive systems.',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Divya Tyagi',
    batch: 'Class of 2024',
    role: 'Spacecraft Avionics Engineer',
    company: 'ISRO Telemetry',
    legacyProject: 'Autonomous Pipeline Inspection UAV',
    quote: 'TRAIC teaches you to respect thermal dissipation, vibration tolerance, and deterministic bus timings before powering on any board.',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Kavita Bhatt',
    batch: 'Class of 2024',
    role: 'Computer Vision Engineer',
    company: 'NVIDIA',
    legacyProject: 'Deep Edge Defect Inspection',
    quote: 'We did not just write Python scripts. We profiled CUDA kernels and memory bandwidth on Jetson modules. That engineering depth was rare.',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Aman Rawat',
    batch: 'Class of 2025',
    role: 'Systems Software Engineer',
    company: 'Microsoft Systems',
    legacyProject: 'Self-Hosted Bare-Metal Hypervisor',
    quote: 'Running our own Proxmox cluster and ZFS storage racks taught me more about operating systems than four semesters of classroom lectures.',
    linkedin: 'https://linkedin.com',
  },
];

export default async function AlumniPage() {
  let alumniList = DEFAULT_ALUMNI;

  try {
    const res = await fetch(`${API_BASE}/public/alumni`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        alumniList = json.data.map((item: any) => ({
          name: item.name,
          batch: item.batch || (item.graduationYear ? `Class of ${item.graduationYear}` : 'Alumni'),
          role: item.currentRole || item.role,
          company: item.currentCompany || item.company,
          legacyProject: item.legacyProject || item.notableProject || 'Hardware Subsystems',
          quote: item.quote,
          photoUrl: item.photoUrl,
          linkedin: item.linkedin || item.socials?.linkedin || 'https://linkedin.com',
        }));
      }
    }
  } catch (err) {
    // Graceful fallback to DEFAULT_ALUMNI
  }

  const companies = [
    'Texas Instruments',
    'Qualcomm',
    'Bosch Engineering',
    'ISRO',
    'NVIDIA',
    'Microsoft',
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4">
      <div className="w-full max-w-apple mx-auto">
        {/* Section 1: Hero */}
        <div className="text-center max-w-[780px] mx-auto mb-16">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
            WHERE TRAIC ALUMNI BUILD
          </span>
          <h1 className="text-[36px] sm:text-[50px] font-display font-bold tracking-tight text-ink-primary mt-3 leading-tight">
            Our builders are at the frontier.
          </h1>
          <p className="mt-4 text-[16px] text-ink-secondary leading-relaxed">
            Graduated TRAIC engineers design silicon, write automotive ECUs, program satellite telemetry, and architect cloud infrastructure at the world's most demanding engineering institutions.
          </p>
        </div>

        {/* Section 2: Placement Strip */}
        <div className="mb-20 p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-subtle">
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-tertiary block text-center mb-6">
            Industry Placements &amp; Advanced Research Labs
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {companies.map((comp) => (
              <span
                key={comp}
                className="font-display font-bold text-[16px] sm:text-[18px] text-ink-primary/90 tracking-tight hover:text-apple-blue transition-colors"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Alumni Cards Grid */}
        <div className="mb-24">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
              GRADUATE DIRECTORY
            </span>
            <h2 className="text-[26px] font-display font-bold text-ink-primary mt-1">
              Alumni Profiles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumniList.map((alumni) => {
              const initials = alumni.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);

              return (
                <div
                  key={alumni.name}
                  className="p-6 rounded-3xl bg-canvas-surface border border-subtle flex flex-col justify-between hover:border-apple-blue/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {alumni.photoUrl ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-canvas border border-subtle shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={alumni.photoUrl} alt={alumni.name} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-canvas border border-subtle flex items-center justify-center font-bold text-apple-blue text-[16px] shrink-0 font-mono">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h3 className="text-[17px] font-display font-bold text-ink-primary">{alumni.name}</h3>
                        <p className="text-[12.5px] text-apple-blue font-medium flex items-center gap-1 mt-0.5">
                          <Briefcase className="h-3 w-3" />
                          <span>{alumni.company}</span>
                        </p>
                        <span className="text-[11px] font-mono text-ink-tertiary">{alumni.batch}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-[11px] font-mono text-ink-tertiary uppercase block">Current Role</span>
                      <p className="text-[13.5px] font-medium text-ink-primary">{alumni.role}</p>
                    </div>

                    {alumni.quote && (
                      <div className="p-3.5 rounded-xl bg-canvas border border-subtle text-[13px] text-ink-secondary italic leading-relaxed relative">
                        <Quote className="h-3.5 w-3.5 text-apple-blue/60 inline mr-1" />
                        &ldquo;{alumni.quote}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-subtle flex items-center justify-between text-[12px]">
                    <span className="text-ink-tertiary font-mono">Legacy: {alumni.legacyProject}</span>
                    {alumni.linkedin && (
                      <a
                        href={alumni.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-apple-blue hover:underline inline-flex items-center gap-1 font-medium min-h-[44px] min-w-[44px] justify-end"
                        aria-label={`${alumni.name} LinkedIn`}
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Admissions CTA */}
        <div className="text-center py-12 rounded-3xl bg-canvas-surface border border-subtle p-8 sm:p-12">
          <h2 className="text-[26px] font-display font-bold text-ink-primary">Want to build alongside this network?</h2>
          <p className="text-[15px] text-ink-secondary mt-2 max-w-[540px] mx-auto">
            Our alumni mentor active members directly, reviewing schematics, giving mock technical interviews, and offering referral recommendations.
          </p>
          <div className="mt-6">
            <Link
              href="/join"
              className="inline-flex items-center justify-center min-h-[44px] px-8 rounded-pill bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-[14px] transition-colors"
            >
              Apply for Cohort 2026 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
