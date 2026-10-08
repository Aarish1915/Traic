import Link from 'next/link';
import { CheckCircle2, ShieldAlert, Cpu, Wrench, Microscope, Gauge, Printer } from 'lucide-react';
import { SpotlightCard } from '@/components/SpotlightCard';

export const metadata = {
  title: 'DIA Labs Instruments & Facility — Block C-302 | TRAIC',
  description: 'Physical equipment, high-speed test benches, CNC milling, additive manufacturing, and safety protocols at DIA Labs, COER University.',
};

export const revalidate = 60; // ISR cache

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface RawGear {
  id?: string;
  name: string;
  model: string;
  category: string;
  specifications: string;
  status: 'OPERATIONAL' | 'IN_USE' | 'MAINTENANCE';
  imageUrl?: string;
  priority?: number;
  isPublished?: boolean;
}

const DEFAULT_STATIONS = [
  {
    stationNum: '01',
    category: 'TESTING',
    stationName: 'Test & Measurement Bench',
    icon: Gauge,
    description: 'High-bandwidth signal analysis, RF characterization, and precision low-noise power delivery.',
    items: [
      { name: 'Tektronix MDO3024', model: '1GHz 4-Channel Mixed Domain Oscilloscope', specs: '5 GS/s Sample Rate, 16 Digital Logic Channels, Spectrum Analyzer to 3GHz', status: 'OPERATIONAL' },
      { name: 'Rigol DSA815-TG', model: '1.5GHz Spectrum Analyzer with Tracking Gen', specs: 'DANL -135 dBm, 100 Hz RBW, RF EMI Compliance Pre-testing', status: 'OPERATIONAL' },
      { name: 'Siglent SPD3303X-E', model: 'Triple Output Programmable Linear DC Supply', specs: '32V / 3.2A Dual Channels, 10mV / 10mA Resolution, Waveform Display', status: 'OPERATIONAL' },
    ],
  },
  {
    stationNum: '02',
    category: 'SOLDERING',
    stationName: 'Soldering & SMD Rework Station',
    icon: Microscope,
    description: 'Precision lead-free soldering, thermal profiling, and microscopic inspection down to 0402 passives.',
    items: [
      { name: 'Hakko FR-810B', model: 'High-Power Digital Hot Air Rework Station', specs: '670W Turbine Airflow, Digital Thermal Profiler, SMD QFN Extraction', status: 'OPERATIONAL' },
      { name: 'Hakko FX-888D', model: 'ESD-Safe Ceramic Soldering Station', specs: '70W Thermal Recovery, T18 Chisel & Fine Conical Tips, 50-480°C', status: 'OPERATIONAL' },
      { name: 'AmScope SM-4TP', model: 'Simul-Focal Stereo Zoom Trinocular Microscope', specs: '7X-45X Continuous Magnification, 144-LED Ring Light, 4K HDMI Sensor', status: 'OPERATIONAL' },
    ],
  },
  {
    stationNum: '03',
    category: 'FABRICATION',
    stationName: 'Additive Manufacturing Bay',
    icon: Printer,
    description: 'High-speed engineering-grade thermoplastic and carbon-fiber composite prototyping.',
    items: [
      { name: 'Bambu Lab X1-Carbon', model: 'Enclosed CoreXY Composite 3D Printer', specs: 'PA-CF & PETG Support, Active Chamber Heat, 500 mm/s Acceleration', status: 'OPERATIONAL' },
      { name: 'Creality Ender-3 V3 KE', model: 'Dual High-Speed Bed Slingers (x2)', specs: '500 mm/s Max Speed, Klipper Firmware, Dual Linear Rails', status: 'OPERATIONAL' },
      { name: 'Sunlu S2 Drybox', model: '360° Filament Dehydrator Unit', specs: 'Real-Time Humidity Monitoring, 70°C Nylon Dehydration Chamber', status: 'OPERATIONAL' },
    ],
  },
  {
    stationNum: '04',
    category: 'ROBOTICS',
    stationName: 'Machining & PCB Prototyping Bay',
    icon: Wrench,
    description: 'Rapid physical fabrication: custom aluminum brackets, acrylic cutouts, and mechanical chassis turning.',
    items: [
      { name: 'CNC 3018-Pro Metal', model: 'PCB Isolation Routing & Milling Machine', specs: 'GRBL 1.1f Control, 0.01mm Precision, 10,000 RPM Spindle', status: 'OPERATIONAL' },
      { name: 'Heavy-Duty Bench Drill Press', model: '5-Speed Variable Belt Drive Press', specs: '13mm Keyed Chuck, Laser Alignment Crosshair, Cast Iron Base', status: 'OPERATIONAL' },
      { name: 'Mitutoyo 500-196-30', model: 'Absolute Digimatic Digital Calipers', specs: '0.01mm Resolution, Carbide-Tipped Jaws, NIST Traceable', status: 'OPERATIONAL' },
    ],
  },
  {
    stationNum: '05',
    category: 'COMPUTE',
    stationName: 'Edge Compute Staging Rack',
    icon: Cpu,
    description: 'Embedded Linux development, neural inference profiling, and multi-node communications validation.',
    items: [
      { name: 'NVIDIA Jetson Orin Nano', model: '67 TOPS Edge AI Developer Kit', specs: '1024-core Ampere GPU, 32 Tensor Cores, 8GB 128-bit LPDDR5', status: 'OPERATIONAL' },
      { name: 'Hailo-8 M.2 Acceleration Module', model: '26 TOPS Neural Coprocessor Card', specs: 'PCIe Gen 3.0 x2, Sub-3W Power Envelope, 60 FPS INT8 Vision', status: 'OPERATIONAL' },
      { name: 'Raspberry Pi 5 Nodes (x4)', model: '8GB Quad-Core Cortex-A76 Cluster', specs: 'PCIe 2.0 Interface, Dual 4K HDMI, Gigabit Ethernet ROS2 Bridge', status: 'OPERATIONAL' },
    ],
  },
];

export default async function GearPage() {
  let stations = DEFAULT_STATIONS;

  try {
    const res = await fetch(`${API_BASE}/public/gear`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        const liveGear: RawGear[] = json.data;
        const categoryMap: Record<string, RawGear[]> = {};
        liveGear.forEach((item) => {
          const cat = item.category || 'TESTING';
          if (!categoryMap[cat]) categoryMap[cat] = [];
          categoryMap[cat].push(item);
        });

        stations = DEFAULT_STATIONS.map((st) => {
          const matchingItems = categoryMap[st.category];
          if (matchingItems && matchingItems.length > 0) {
            return {
              ...st,
              items: matchingItems.map((g) => ({
                name: g.name,
                model: g.model,
                specs: g.specifications,
                status: g.status || 'OPERATIONAL',
              })),
            };
          }
          return st;
        });

        const configuredCategories = new Set(DEFAULT_STATIONS.map((s) => s.category));
        let stationIdx = 6;
        Object.entries(categoryMap).forEach(([cat, items]) => {
          if (!configuredCategories.has(cat)) {
            stations.push({
              stationNum: String(stationIdx).padStart(2, '0'),
              category: cat,
              stationName: `${cat} Station`,
              icon: Wrench,
              description: `Precision equipment and dedicated tooling configured for ${cat.toLowerCase()} workflows.`,
              items: items.map((g) => ({
                name: g.name,
                model: g.model,
                specs: g.specifications,
                status: g.status || 'OPERATIONAL',
              })),
            });
            stationIdx++;
          }
        });
      }
    }
  } catch (err) {
    // Fall back to DEFAULT_STATIONS on network errors
  }

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4">
      <div className="w-full max-w-apple mx-auto">
        {/* Section 1: Hero */}
        <div className="text-center max-w-[840px] mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-canvas-surface border border-subtle text-[11px] font-mono text-apple-blue font-bold mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-ink-primary/70 animate-pulse" />
            <span>DIA LABS // BLOCK C-302</span>
          </div>
          <h1 className="text-[38px] sm:text-[54px] font-display font-extrabold tracking-[-0.035em] text-ink-primary mt-2 leading-[1.04]">
            Physical Workstations &amp; Calibrated Instruments
          </h1>
          <p className="mt-5 text-[17px] sm:text-[19px] text-ink-secondary leading-relaxed">
            DIA Labs is a 1,200 sq. ft. precision engineering facility inside COER University. Every active cohort builder receives hands-on clearance across high-bandwidth oscilloscopes, SMD rework stations, and composite fabrication bays.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[12px] font-mono text-ink-tertiary">
            <span className="px-3 py-1 rounded-pill bg-canvas-surface border border-subtle">24/7 BADGE CLEARANCE</span>
            <span>•</span>
            <span className="px-3 py-1 rounded-pill bg-canvas-surface border border-subtle text-ink-secondary">ALL BENCHES OPERATIONAL</span>
            <span>•</span>
            <span className="px-3 py-1 rounded-pill bg-canvas-surface border border-subtle">CALIBRATION CURRENT (Q3 2026)</span>
          </div>
        </div>

        {/* Section 2: Lab Stations */}
        <div className="space-y-12 mb-24">
          {stations.map((station) => {
            const Icon = station.icon;
            return (
              <SpotlightCard
                key={station.stationNum}
                className="p-8 sm:p-12 rounded-3xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-subtle">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-canvas border border-subtle flex items-center justify-center text-apple-blue shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-apple-blue font-bold">
                        STATION {station.stationNum}
                      </span>
                      <h2 className="text-[22px] sm:text-[28px] font-display font-bold text-ink-primary">
                        {station.stationName}
                      </h2>
                    </div>
                  </div>
                  <p className="text-[14px] text-ink-secondary max-w-[460px] leading-relaxed">
                    {station.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {station.items.map((item, itemIdx) => {
                    const isOperational = item.status === 'OPERATIONAL';
                    const isInUse = item.status === 'IN_USE';
                    const statusText = isOperational ? 'OPERATIONAL' : isInUse ? 'IN USE' : 'MAINTENANCE';
                    const statusColor = isOperational
                      ? 'text-ink-primary'
                      : isInUse
                      ? 'text-apple-blue'
                      : 'text-amber-400';
                    const statusDot = isOperational
                      ? 'bg-ink-primary shadow-[0_0_8px_rgba(245,245,247,0.6)]'
                      : isInUse
                      ? 'bg-apple-blue shadow-[0_0_8px_rgba(41,151,255,0.6)]'
                      : 'bg-amber-400';

                    return (
                      <div
                        key={`${station.stationNum}-${item.name}-${item.model || ''}-${itemIdx}`}
                        className="p-5 rounded-2xl bg-canvas border border-subtle flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono uppercase text-ink-tertiary font-bold">INSTRUMENT</span>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-canvas-surface border border-subtle text-[10.5px] font-mono ${statusColor}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                              <span>{statusText}</span>
                            </div>
                          </div>
                          <h3 className="text-[17px] font-bold text-ink-primary">{item.name}</h3>
                          <p className="mt-1 text-[13.5px] text-ink-secondary font-medium">{item.model}</p>
                          <p className="mt-3 text-[12.5px] text-ink-secondary leading-relaxed">{item.specs}</p>
                        </div>

                        <div className="mt-6 pt-3 border-t border-subtle/50 text-[11px] font-mono text-ink-tertiary">
                          Bench Calibration Passed
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* Section 3: Safety & Access Protocols */}
        <SpotlightCard className="mb-20 p-8 sm:p-12 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 text-apple-blue">
            <ShieldAlert className="h-6 w-6 text-apple-blue" />
            <h2 className="text-[24px] sm:text-[28px] font-display font-bold text-ink-primary">
              DIA Labs Safety &amp; Access Protocol
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[14.5px] text-ink-secondary leading-relaxed">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-apple-blue shrink-0 mt-0.5" />
                <span>
                  <strong>Mandatory ESD Grounding:</strong> Anti-static wristbands connected to verified common ground studs must be worn before touching populated PCB assemblies or bare silicon dies.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-apple-blue shrink-0 mt-0.5" />
                <span>
                  <strong>Active Fume Extraction:</strong> High-efficiency carbon fume absorbers must run during any hand-soldering, lead-free reflow, or filament extrusion in Bay 2 and 3.
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-apple-blue shrink-0 mt-0.5" />
                <span>
                  <strong>The 22:00 Buddy Rule:</strong> After 22:00, no member may operate power tools, soldering stations, or CNC routers without a second certified builder present in Block C-302.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-apple-blue shrink-0 mt-0.5" />
                <span>
                  <strong>Bench Reservations:</strong> Precision oscilloscopes and spectrum analyzers are booked via the self-hosted lab portal to prevent scheduling clashes during competition sprints.
                </span>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Section 4: Admissions CTA */}
        <div className="text-center py-8">
          <h2 className="text-[28px] font-display font-bold text-ink-primary">Want bench clearance inside DIA Labs?</h2>
          <p className="mt-2 text-[15.5px] text-ink-secondary max-w-[520px] mx-auto">
            All enrolled cohort members undergo our mandatory 2-week hands-on bench certification.
          </p>
          <div className="mt-6">
            <Link
              href="/join"
              className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-pill bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-[14.5px] active:scale-95 transition-all shadow-md"
            >
              Apply for Cohort 2026 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
