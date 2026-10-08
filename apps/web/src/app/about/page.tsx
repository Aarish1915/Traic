import Link from 'next/link';
import { Compass, Shield, HeartHandshake, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'About TRAIC — Technology, Robotics & AI Community',
  description: 'Our founding story, collegiate engineering creed, core values, and faculty advisors at DIA Labs, COER University.',
};

export const revalidate = 60; // ISR cache

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default async function AboutPage() {
  let clubName = 'TRAIC';
  let mottoText = 'Honor · Honesty · Sacrifice';
  let labLocation = 'DIA Labs (Block C-302) at COER University';
  let tagline = 'Technology, Robotics & AI Community';

  try {
    const res = await fetch(`${API_BASE}/public/settings`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        if (json.data.clubName) clubName = json.data.clubName;
        if (json.data.mottoText) mottoText = json.data.mottoText.replace(/•/g, '·');
        if (json.data.labLocation) labLocation = json.data.labLocation;
        if (json.data.tagline) tagline = json.data.tagline;
      }
    }
  } catch (err) {
    // Fall back to defaults
  }

  const values = [
    {
      title: 'Honor',
      subtitle: 'Integrity in Engineering',
      desc: 'We build hardware that adheres to real physics and rigorous safety tolerances. We do not fake sensor data, spoof telemetry, or exaggerate capabilities.',
      icon: Shield,
    },
    {
      title: 'Honesty',
      subtitle: 'Transparent Attribution',
      desc: 'We openly credit open-source libraries, acknowledge design errors, and review failure traces with absolute intellectual candor.',
      icon: HeartHandshake,
    },
    {
      title: 'Sacrifice',
      subtitle: 'Dedication to the Craft',
      desc: 'Mastery demands late nights at the soldering station, reading 1,000-page silicon datasheets, and debugging kernel race conditions until it works.',
      icon: Compass,
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4">
      <div className="w-full max-w-apple mx-auto">
        {/* Section 1: Hero & Mission Statement */}
        <div className="text-center max-w-[840px] mx-auto mb-20">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
            ABOUT {clubName}
          </span>
          <h1 className="text-[36px] sm:text-[50px] font-display font-bold tracking-tight text-ink-primary mt-3 leading-[1.12]">
            We do not lecture from slides. We put soldering irons into your hands on day one.
          </h1>
          <p className="mt-6 text-[17px] text-ink-secondary leading-relaxed">
            {clubName} ({tagline}) is an autonomous collegiate laboratory based out of {labLocation}. Founded by undergraduate builders who refused to settle for theoretical computer science and canned breadboard kits.
          </p>
        </div>

        {/* Section 2: Founding Story */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-20 p-8 sm:p-12 rounded-3xl bg-canvas-surface border border-subtle">
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-bold">
                THE GENESIS
              </span>
              <h2 className="text-[28px] font-display font-bold text-ink-primary mt-2">
                Born out of raw frustration with canned hobby kits.
              </h2>
            </div>
            <div className="mt-6 font-mono text-[12px] text-ink-tertiary">
              ESTABLISHED 2021 // ROORKEE, INDIA
            </div>
          </div>

          <div className="md:col-span-7 space-y-4 text-[15px] text-ink-secondary leading-relaxed">
            <p>
              In 2021, a group of electrical and computer engineering students noticed a troubling disconnect: classrooms taught 1980s 8051 assembly on paper, while the frontier of autonomous robotics and edge silicon was advancing exponentially.
            </p>
            <p>
              We cleared a bench in the corner of Block C, pooled our own pocket money for a Hakko soldering station and a digital multimeter, and began designing our own microcontroller breakout boards. That single workbench evolved into the Design &amp; Innovation Academy (DIA Labs).
            </p>
            <p>
              Today, {clubName} operates a 24/7 research bay equipped with 1GHz oscilloscopes, automated SMD reflow stations, high-speed 3D printers, and bare-metal server racks running our private compute cloud.
            </p>
          </div>
        </div>

        {/* Section 3: Three Core Values */}
        <div className="my-24">
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
              THE ETHOS
            </span>
            <h2 className="text-[30px] font-display font-bold text-ink-primary mt-2">
              {mottoText}
            </h2>
            <p className="text-[14.5px] text-ink-secondary mt-2">
              The immutable principles etched into every PCB, chassis, and line of firmware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-8 rounded-3xl bg-canvas-surface border border-subtle flex flex-col justify-between hover:border-apple-blue/30 transition-colors"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-canvas flex items-center justify-center text-apple-blue border border-subtle mb-6">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-[22px] font-display font-bold text-ink-primary">{v.title}</h3>
                    <div className="text-[12px] font-mono text-apple-blue uppercase tracking-wider mt-1 mb-4">
                      {v.subtitle}
                    </div>
                    <p className="text-[14px] text-ink-secondary leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Faculty Advisor & Institutional Guidance */}
        <div className="my-24 p-8 sm:p-12 rounded-3xl bg-canvas-surface border border-subtle">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-28 h-28 rounded-2xl bg-canvas border border-subtle flex items-center justify-center text-apple-blue shadow-sm mb-4">
                <BookOpen className="h-12 w-12 text-apple-blue" />
              </div>
              <h3 className="text-[20px] font-display font-bold text-ink-primary">Faculty Advisory Board</h3>
              <p className="text-[13px] text-ink-secondary mt-1">School of Engineering, COER University</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-canvas border border-subtle text-[11px] font-mono text-apple-blue">
                <span>Academic Sponsorship</span>
              </div>
            </div>

            <div className="md:col-span-8 text-[15px] text-ink-secondary leading-relaxed space-y-4">
              <p>
                TRAIC operates under the official sanction and mentorship of senior faculty from the Department of Electronics &amp; Communication and Computer Science Engineering at COER University.
              </p>
              <p>
                Our faculty advisors ensure academic continuity, facilitate institutional patent filings through the University IPR Cell, and sponsor national competition delegations representing Uttarakhand at Smart India Hackathon and Robocon.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Call to Action */}
        <div className="text-center py-12">
          <h2 className="text-[26px] font-display font-bold text-ink-primary">Want to be part of our next chapter?</h2>
          <p className="text-[15px] text-ink-secondary mt-2 max-w-[500px] mx-auto">
            Admissions open once every semester. We evaluate commitment, problem-solving mindset, and engineering hunger.
          </p>
          <div className="mt-8">
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
