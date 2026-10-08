'use client';

import React, { useState } from 'react';
import { Cpu, ShieldCheck, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SubsystemLayer {
  id: string;
  index: string;
  tag: string;
  title: string;
  subtitle: string;
  siliconBOM: string[];
  specs: { label: string; value: string }[];
  description: string;
  telemetryMetric: string;
}

const HARDWARE_LAYERS: SubsystemLayer[] = [
  {
    id: 'layer-3',
    index: '01',
    tag: 'HETEROGENEOUS COMPUTATION',
    title: 'Dual-Silicon Architecture: Deterministic M7 + Edge NPU',
    subtitle: 'Ultra-low-latency real-time control coupled with 26 TOPS quantized neural acceleration.',
    siliconBOM: [
      'STM32H753ZI (480MHz ARM Cortex-M7/M4 Dual-Core)',
      'Hailo-8 M.2 AI Acceleration Module (26 TOPS @ 2.5W)',
      'TI TPS65988 Dual-Port Power Delivery Controller',
      'IS61WV102416BLL High-Speed 16Mb Asynchronous SRAM',
    ],
    specs: [
      { label: 'Control Loop Deadlines', value: '< 10 μs Deterministic' },
      { label: 'Neural Throughput', value: '26 TOPS (INT8)' },
      { label: 'Host Interface', value: 'PCIe Gen3 x2 / Dual QSPI' },
      { label: 'Clock Frequency', value: '480 MHz Core' },
    ],
    description:
      'Similar to modern spatial systems decoupling general compute from sensory fusion, our robots decouple motor kinematics from computer vision. The ARM Cortex-M7 handles hard-real-time motor control loops, while the Hailo-8 M.2 coprocessor runs 60 FPS YOLOv8 obstacle avoidance without CPU starvation.',
    telemetryMetric: '0.008 ms Jitter • 26.2 TOPS Peak',
  },
  {
    id: 'layer-4',
    index: '02',
    tag: 'DETERMINISTIC BUS & SENSORS',
    title: 'CAN-FD 5.0 Mbps Bus & 6-DOF Inertial Array',
    subtitle: 'Differential noise-immune signaling with hardware CRC-16 frame validation.',
    siliconBOM: [
      'TI TCAN1042V High-Speed CAN-FD Transceiver (5 Mbps)',
      'Bosch Sensortec BMI088 6-DOF Industrial Vibration-Immune IMU',
      'STMicro STGAP2S Galvanically Isolated MOSFET Gate Drivers',
      'Saleae 16-Channel Logic Analyzer Bench Tap Headers',
    ],
    specs: [
      { label: 'Bus Bandwidth', value: '5.0 Mbps CAN-FD' },
      { label: 'IMU Bias Stability', value: '< 0.005 °/s' },
      { label: 'Galvanic Isolation', value: '2.5 kV RMS' },
      { label: 'Frame Verification', value: 'Hardware CRC-16' },
    ],
    description:
      'Industrial robotic telemetry cannot tolerate dropped packets or ground potential shifts. All actuator nodes communicate over a 120Ω terminated CAN-FD differential bus, shielded against high-current inductive motor switching transients.',
    telemetryMetric: '5,000,000 Baud • 0 Packet Loss',
  },
  {
    id: 'layer-2',
    index: '03',
    tag: 'POWER & THERMAL SUB-PLANE',
    title: '4-Layer High-TG FR-4 Power Distribution Bus',
    subtitle: 'Optimized copper return paths with isolated switching regulators and reverse-polarity protection.',
    siliconBOM: [
      'TI LM5145 75V Synchronous Buck DC-DC Controller',
      'Infineon BSC093N04LS 40V Low-RDS(on) Power MOSFETs',
      'Coilcraft XAL7070 High-Current Shielded Inductors',
      'NXP Ideal Diode Active Reverse-Polarity Protection',
    ],
    specs: [
      { label: 'Input Voltage Range', value: '18V – 54V DC (6S–12S LiPo)' },
      { label: 'Peak Power Output', value: '1.2 kW Continuous' },
      { label: 'Thermal Dissipation Vias', value: '0.3mm Array @ 1.0mm Pitch' },
      { label: 'Copper Weight', value: '70 μm (2 oz) Outer / Inner' },
    ],
    description:
      'Engineered in KiCad 8.0 with dedicated ground return planes beneath every high-current switching node. The board features thermal copper relief matrices directly under power MOSFETs, allowing continuous 40A bench operation without thermal throttling.',
    telemetryMetric: '96.4% Efficiency • 1.2 kW Bus',
  },
  {
    id: 'layer-1',
    index: '04',
    tag: 'KINEMATICS & ENCLOSURE',
    title: 'CNC 6061-T6 Aluminum & Carbon Composite Chassis',
    subtitle: 'Billet-machined structural ribs and high-impact additive carbon-fiber enclosures.',
    siliconBOM: [
      'Billet CNC Milled 6061-T6 Aerospace Aluminum Brackets',
      'Toray 3K Twill Carbon-Fiber Structural Lower Deck Plates',
      'Bambu Lab Carbon-Fiber Reinforced PETG (PETG-CF) Ducts',
      'Stainless Steel 316 A4-70 Marine-Grade Torx Fasteners',
    ],
    specs: [
      { label: 'Tensile Strength', value: '310 MPa (Chassis)' },
      { label: 'Total Weight', value: '4.2 kg (with battery)' },
      { label: 'Payload Capacity', value: '12.0 kg Bench Verified' },
      { label: 'Resonance Dampening', value: 'Shore 60A Sorbothane' },
    ],
    description:
      'Rigidity is essential for high-frequency PID stability. Machined at DIA Labs on precision 3-axis CNC equipment and additive manufacturing stations, the chassis isolates motor vibration from sensitive optical and LiDAR payloads.',
    telemetryMetric: '310 MPa Yield • 4.2 kg Mass',
  },
  {
    id: 'layer-5',
    index: '05',
    tag: 'SYSTEMS SOVEREIGNTY',
    title: 'Self-Hosted Bare-Metal Hypervisor & Telemetry Daemon',
    subtitle: 'On-premise Proxmox cluster, ZFS storage pool, and cryptographic WireGuard telemetry mesh.',
    siliconBOM: [
      'AMD EPYC Enterprise Compute Cluster (DIA Labs Server Room)',
      'Dual 10GbE SFP+ Direct-Attach Copper (DAC) Backbone',
      'ZFS Enterprise Mirror Storage Pool (Automated Snapshots)',
      'Cryptographic WireGuard Mesh VPN Daemon (Zero Cloud Dependency)',
    ],
    specs: [
      { label: 'Internal Bandwidth', value: '10 Gbps Low-Latency SFP+' },
      { label: 'Storage Reliability', value: 'ZFS RAID-Z2 Mirror' },
      { label: 'CI/CD Pipeline', value: 'Local Woodpecker CI / Forgejo' },
      { label: 'Telemetry Tunnel', value: 'WireGuard Curve25519' },
    ],
    description:
      'No proprietary cloud lock-in. All firmware builds, CAD assemblies, telemetry datalogs, and AI inference models reside on our private laboratory server rack, accessible securely across campus.',
    telemetryMetric: '10 Gbps SFP+ • Zero Cloud Lock-in',
  },
];

export function SpatialExplodedHardware() {
  const [activeLayerId, setActiveLayerId] = useState<string>(HARDWARE_LAYERS[0].id);

  const activeLayer =
    HARDWARE_LAYERS.find((l) => l.id === activeLayerId) || HARDWARE_LAYERS[0];

  return (
    <section className="mb-24 relative">
      <div className="w-full max-w-apple mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-[820px] mx-auto mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold">
            ARCHITECTURE &amp; SILICON SUB-SYSTEMS
          </span>
          <h2 className="text-[34px] sm:text-[48px] font-display font-extrabold tracking-[-0.035em] text-ink-primary mt-2 leading-[1.08]">
            Physical silicon sovereignty. Dissected.
          </h2>
          <p className="mt-3 text-[16px] sm:text-[18px] text-ink-secondary max-w-[680px] mx-auto leading-relaxed">
            Every layer of our robotics stack is designed from raw silicon schematics to CNC-milled aluminum. Select a sub-system to inspect the hardware bill of materials.
          </p>
        </div>

        {/* Spatial Layer Navigation Pills (Apple Segmented Style) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {HARDWARE_LAYERS.map((layer) => {
            const isActive = layer.id === activeLayerId;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayerId(layer.id)}
                className={`min-h-[44px] px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-ink-primary text-canvas shadow-md border border-ink-primary'
                    : 'bg-canvas-surface hover:bg-canvas-elevated text-ink-secondary hover:text-ink-primary border border-subtle'
                }`}
                aria-pressed={isActive}
              >
                <span className="font-mono text-[11px] opacity-70">{layer.index}</span>
                <span>{layer.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Main Spatial Glass Display Card */}
        <div
          className="relative rounded-3xl overflow-hidden bg-canvas-surface backdrop-blur-xl border border-subtle p-8 sm:p-12 transition-all duration-500 shadow-xl"
        >
          {/* Subtle Ambient Raytrace Glow */}
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-60 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(600px circle at 80% 20%, rgba(41, 151, 255, 0.12), transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Deep Hardware Architecture Details */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="px-3 py-1 rounded-full bg-canvas-elevated border border-subtle font-mono text-[11px] font-bold text-ink-primary">
                    LAYER {activeLayer.index} • {activeLayer.tag}
                  </span>
                  <span className="font-mono text-[11px] text-ink-tertiary">
                    {activeLayer.telemetryMetric}
                  </span>
                </div>

                <h3 className="text-[24px] sm:text-[30px] font-display font-bold text-ink-primary leading-tight mt-1">
                  {activeLayer.title}
                </h3>
                <p className="text-[14px] text-ink-secondary font-medium mt-1 mb-4">
                  {activeLayer.subtitle}
                </p>

                <p className="text-[14.5px] text-ink-secondary leading-relaxed mb-6">
                  {activeLayer.description}
                </p>

                {/* Silicon Bill of Materials */}
                <div className="mt-6 pt-6 border-t border-subtle">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ink-tertiary block mb-3 font-bold">
                    Silicon Bill of Materials &amp; Integrated Circuits
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeLayer.siliconBOM.map((part, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-xl bg-canvas border border-subtle text-[12.5px] font-mono text-ink-primary flex items-center gap-2"
                      >
                        <Cpu className="h-3.5 w-3.5 text-ink-tertiary shrink-0" />
                        <span className="truncate">{part}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link to Full Project Dossier */}
              <div className="mt-8 pt-6 border-t border-subtle/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-ink-tertiary font-mono text-[11.5px]">
                  <Activity className="h-3.5 w-3.5 text-ink-primary" />
                  <span>Verified on DIA Labs Bench B-04</span>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-apple-blue hover:underline min-h-[44px]"
                >
                  <span>Explore Hardware Sub-Assemblies</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Spec Benchmarks Grid */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="p-6 sm:p-7 rounded-2xl bg-canvas-elevated/40 border border-subtle">
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold block mb-4">
                  EMPIRICAL HARDWARE SPECIFICATIONS
                </span>
                <div className="space-y-4">
                  {activeLayer.specs.map((spec, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-xl bg-canvas border border-subtle flex items-center justify-between"
                    >
                      <span className="text-[12.5px] text-ink-secondary font-medium">
                        {spec.label}
                      </span>
                      <span className="font-mono text-[13px] font-bold text-ink-primary">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spatial Architecture Note Box */}
              <div className="mt-4 p-5 rounded-2xl bg-canvas-elevated/30 border border-subtle text-[12.5px] text-ink-tertiary leading-relaxed">
                <div className="flex items-center gap-2 text-ink-primary font-bold mb-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Hardware Isolation Standard</span>
                </div>
                Galvanically isolated signals and independent power planes protect the Cortex-M7 core from motor inductive flyback during dynamic brake maneuvers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
