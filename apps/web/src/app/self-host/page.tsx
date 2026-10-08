import Link from 'next/link';
import { Server, ShieldCheck, Terminal, Cpu, Database, Network, KeyRound, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Self-Hosted Systems Sovereignty — TRAIC Infrastructure',
  description: 'On-premise server rack architecture, Proxmox hypervisors, vLLM private neural inference, and Linux systems engineering at DIA Labs.',
};

export default function SelfHostPage() {
  const rackNodes = [
    {
      name: 'Node 01 // Hypervisor Alpha',
      role: 'Virtualization & Container Cluster',
      chassis: 'Dell PowerEdge 1U Enterprise Rackmount',
      specs: [
        'Dual Intel Xeon Scalable Processors (32 Cores / 64 Threads)',
        '128 GB ECC Registered DDR4 RAM',
        '4× 1TB Enterprise NVMe in ZFS Mirror Pool',
        'Dual 10GbE SFP+ Optical Uplinks',
      ],
      os: 'Proxmox VE 8.2 Hypervisor',
      services: ['LXC Container Namespaces', 'Woodpecker CI Automated Runners', 'Mesh Network Core'],
    },
    {
      name: 'Node 02 // Inference Beta',
      role: 'Private GPU Accelerated AI Compute',
      chassis: 'Custom 4U High-Airflow Server Chassis',
      specs: [
        'AMD Ryzen 9 7900X (12 Cores / 24 Threads @ 5.6 GHz Boost)',
        '64 GB DDR5-6000 MHz Low-Latency Memory',
        'Dual NVIDIA RTX 4080 Super (32GB Aggregate VRAM)',
        'Dedicated 1200W Platinum Power Supply',
      ],
      os: 'Ubuntu Server 24.04 LTS (NVIDIA CUDA 12.4)',
      services: ['vLLM Distributed Model Server', 'Ollama Embedded Quantization', 'TensorRT-LLM Microservices'],
    },
    {
      name: 'Node 03 // Storage Gamma',
      role: 'Persistent CAD, Telemetry & Archive Vault',
      chassis: 'Supermicro 2U 12-Bay Hot-Swap Array',
      specs: [
        'Intel Xeon E-2388G 8-Core Processor',
        '64 GB ECC DDR4 Unbuffered RAM',
        '6× 8TB Enterprise SATA HDDs in RAID-Z2 (32TB Usable)',
        '2× 500GB NVMe ZFS Read Cache (L2ARC)',
      ],
      os: 'TrueNAS SCALE (ZFS File System)',
      services: ['Automated Hourly ZFS Snapshots', 'Offsite Cryptographic Backups', 'Robotics Telemetry Datasets'],
    },
  ];

  const runningServices = [
    { name: 'Forgejo Git', desc: 'Self-hosted lightweight Git forge. All proprietary schematics and firmware stay on our physical disks.', icon: Server },
    { name: 'Woodpecker CI', desc: 'Containerized continuous integration compiling KiCad Gerbers and C++ firmware tests automatically.', icon: Terminal },
    { name: 'vLLM & Ollama', desc: 'Private 70B & 8B parameter code assistance. Zero telemetry or code ever exits the building.', icon: Cpu },
    { name: 'WireGuard VPN', desc: 'Encrypted ChaCha20-Poly1305 mesh VPN granting members secure remote access to lab benches.', icon: Network },
    { name: 'BookStack Wiki', desc: 'Comprehensive hardware documentation, pinout registries, and equipment SOPs.', icon: Database },
    { name: 'Vaultwarden', desc: 'Self-hosted, end-to-end encrypted password and API token vault for lab systems.', icon: KeyRound },
  ];

  const memberPrivileges = [
    'Personal Linux shell account with persistent home directory on NVMe storage',
    'Dedicated LXC container or Docker namespace for project development',
    'WireGuard configuration profile for remote bench access from dorms or home',
    'Unmetered access to on-premise GPU inference APIs for robotics models',
    'Automatic hourly ZFS snapshots protecting against accidental code deletion',
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4">
      <div className="w-full max-w-apple mx-auto">
        {/* Section 1: Hero */}
        <div className="text-center max-w-[840px] mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-canvas-surface border border-subtle text-[11px] font-mono text-apple-blue mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-apple-blue animate-pulse" />
            <span>SYSTEMS SOVEREIGNTY // BARE-METAL COMPUTE</span>
          </div>
          <h1 className="text-[36px] sm:text-[52px] font-display font-bold tracking-tight text-ink-primary mt-2 leading-[1.08]">
            We own our infrastructure. Every single bit of it.
          </h1>
          <p className="mt-4 text-[16px] sm:text-[18px] text-ink-secondary leading-relaxed">
            While others rely on expensive proprietary cloud SaaS, TRAIC operates an on-premise server rack inside DIA Labs. We teach students the discipline of true systems engineering: hypervisors, ZFS storage pools, and private local neural inference.
          </p>
        </div>

        {/* Section 2: Server Rack Specs */}
        <div className="mb-24">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
              RACK HARDWARE SPECIFICATIONS
            </span>
            <h2 className="text-[28px] font-display font-bold text-ink-primary mt-1">
              DIA Labs Server Rack — 42U Array
            </h2>
          </div>

          <div className="space-y-8">
            {rackNodes.map((node) => (
              <div
                key={node.name}
                className="p-8 sm:p-10 rounded-3xl bg-canvas-surface border border-subtle hover:border-apple-blue/30 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-apple-blue font-bold block mb-1">
                        {node.name}
                      </span>
                      <h3 className="text-[22px] sm:text-[26px] font-display font-bold text-ink-primary">
                        {node.role}
                      </h3>
                      <p className="text-[13px] font-mono text-ink-tertiary mt-2">
                        {node.chassis}
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-subtle">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-ink-tertiary block mb-2">
                        Operating System
                      </span>
                      <span className="text-[14px] font-medium text-apple-blue">
                        {node.os}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-semibold block mb-3">
                        Silicon &amp; Memory Allocation
                      </span>
                      <div className="space-y-2">
                        {node.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="p-3 rounded-xl bg-canvas border border-subtle text-[13px] font-mono text-ink-secondary flex items-start gap-2">
                            <span className="text-apple-blue">›</span>
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-semibold block mb-2">
                        Active Services
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {node.services.map((srv) => (
                          <span key={srv} className="px-3 py-1 rounded-pill bg-canvas border border-subtle text-[11.5px] font-mono text-ink-primary">
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Running Services Bento */}
        <div className="mb-24">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
              LOCAL HOSTED APPLICATION STACK
            </span>
            <h2 className="text-[28px] font-display font-bold text-ink-primary mt-1">
              Zero Cloud Lock-in
            </h2>
            <p className="text-[15px] text-ink-secondary mt-1">
              Open-source, self-hosted services powering daily engineering workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {runningServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.name}
                  className="p-6 rounded-3xl bg-canvas-surface border border-subtle flex flex-col justify-between hover:border-apple-blue/30 transition-colors"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-canvas border border-subtle flex items-center justify-center text-apple-blue mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[17px] font-display font-bold text-ink-primary">{srv.name}</h3>
                    <p className="text-[13.5px] text-ink-secondary mt-2 leading-relaxed">{srv.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-subtle flex items-center gap-1.5 text-[11px] font-mono text-[var(--status-emerald)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-emerald)]" />
                    <span>Self-Hosted &amp; Healthy</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Student Builder Access Privileges */}
        <div className="mb-20 p-8 sm:p-12 rounded-3xl bg-canvas-surface border border-subtle">
          <div className="flex items-center gap-3 mb-6 text-apple-blue">
            <ShieldCheck className="h-6 w-6 text-apple-blue" />
            <h2 className="text-[24px] font-display font-bold text-ink-primary">
              Student Builder Access Package
            </h2>
          </div>
          <p className="text-[15px] text-ink-secondary leading-relaxed mb-6 max-w-[720px]">
            Every admitted recruit receives immediate access to our self-hosted computing cluster upon clearing the 2-week lab induction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberPrivileges.map((priv, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-canvas border border-subtle flex items-start gap-3 text-[13.5px] text-ink-secondary">
                <CheckCircle2 className="h-4 w-4 text-apple-blue shrink-0 mt-0.5" />
                <span>{priv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Admissions CTA */}
        <div className="text-center py-8">
          <h2 className="text-[26px] font-display font-bold text-ink-primary">Want your own Linux shell account on our rack?</h2>
          <p className="mt-2 text-[15px] text-ink-secondary max-w-[500px] mx-auto">
            Join the only student collective on campus with dedicated bare-metal infrastructure.
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
