import { ProjectDetailClient, ProjectDetail } from './ProjectDetailClient';

export const revalidate = 60;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const FALLBACK_PROJECTS: Record<string, ProjectDetail> = {
  'pipeline-inspection-rover': {
    slug: 'pipeline-inspection-rover',
    title: 'Autonomous Pipeline Inspection Rover',
    category: 'HARDWARE',
    year: '2024',
    status: 'OPERATIONAL',
    tagline: 'Dual-drive tracked crawler with RTAB-Map LiDAR SLAM & ultrasonic thickness probe.',
    description: 'Designed for confined petrochemical pipelines with hazardous gas detection and real-time visual defect classification.',
    tech: ['ROS2 Humble', 'STM32H753', 'Hailo-8', 'CAN-FD', 'LiDAR SLAM'],
    specs: [
      { label: 'Compute Architecture', value: 'NVIDIA Jetson Orin Nano + STM32H753' },
      { label: 'Neural Throughput', value: '26 TOPS INT8 @ 2.5W' },
      { label: 'Control Bus', value: 'Isolated ISO CAN-FD (5.0 Mbps)' },
      { label: 'Power Subsystem', value: '4S LiFePO4 with LTC4151 I2C Coulometer' },
      { label: 'Chassis Material', value: '6061-T6 Billet Aluminum CNC Milled' },
    ],
    bom: [
      { component: 'Primary MCU', partNumber: 'STM32H753VIT6', function: 'ARM Cortex-M7 @ 480MHz, FreeRTOS PID Loop' },
      { component: 'Edge Neural Coprocessor', partNumber: 'Hailo-8 M.2', function: 'YOLOv8 Real-Time Tensor Accelerator' },
      { component: 'CAN-FD Transceiver', partNumber: 'TCAN334GDCNT', function: '5 Mbps Fault-Tolerant Bus Interface' },
      { component: 'Dual H-Bridge Driver', partNumber: 'DRV8874-Q1', function: 'Integrated Current Sensing, 37V Peak' },
      { component: 'Buck Regulator', partNumber: 'LMR33630', function: 'Synchronous Step-Down 36V to 5V 3A' },
      { component: 'Digital IMU', partNumber: 'BMI088', function: '6-Axis Low-Noise Automotive Gyro + Accel' },
    ],
    team: [
      { name: 'Aarish Ali', role: 'Avionics Architecture & Firmware' },
      { name: 'Rohan Sharma', role: 'LiDAR SLAM & Edge Model Optimization' },
      { name: 'Vikram Mehta', role: 'Mechanical Chassis CNC Milling' },
    ],
    awards: [
      'Smart India Hackathon 2024 — 1st Place National Champions',
      'Patent Filed — Indian Patent Office Docket No. 2024110892',
    ],
    repoUrl: 'https://github.com/traiccoer2025-code',
  },
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project: ProjectDetail | null = null;

  try {
    const res = await fetch(`${API_BASE}/public/projects/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        const d = json.data;
        project = {
          slug: d.slug,
          title: d.title,
          category: d.category || 'HARDWARE',
          year: d.year || '2024',
          status: d.status || 'OPERATIONAL',
          tagline: d.tagline || d.summary || '',
          description: d.descriptionMd || d.description || '',
          tech: d.tech || d.techStack || [],
          repoUrl: d.repoUrl,
          demoUrl: d.demoUrl,
          specs: d.specs ? Object.entries(d.specs).map(([k, v]) => ({ label: k, value: String(v) })) : undefined,
          bom: d.bom,
          team: d.team,
          awards: d.awards,
        };
      }
    }
  } catch (err) {
    // Fall back to local map
  }

  if (!project) {
    project = FALLBACK_PROJECTS[slug] || null;
  }

  if (!project) {
    // If not found in API or fallback map, generate generic fallback so page doesn't crash
    project = {
      slug,
      title: slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      category: 'HARDWARE',
      year: '2024',
      status: 'OPERATIONAL',
      tagline: 'Custom collegiate hardware engineering system built inside DIA Labs.',
      description: 'Physical hardware project designed, fabricated, and validated by TRAIC builders.',
      tech: ['Embedded Systems', 'PCB Design', 'FreeRTOS', 'C++'],
      repoUrl: 'https://github.com/traiccoer2025-code',
    };
  }

  return <ProjectDetailClient project={project} />;
}
