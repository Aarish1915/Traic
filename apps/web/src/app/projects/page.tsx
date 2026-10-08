import { ClientProjects } from './ClientProjects';

export const revalidate = 60; // ISR config

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const FALLBACK_PROJECTS = [
  {
    slug: 'autonomous-ugv-rover',
    title: 'Autonomous Field Rover (UGV-X)',
    tagline: 'All-terrain autonomous rover equipped with LiDAR, stereo depth cameras, and ROS2 navigation.',
    category: 'HYBRID',
    year: 2024,
    tech: ['ROS2', 'C++', 'Python', 'RTAB-Map', 'LiDAR', 'CAN Bus', 'NVIDIA Jetson'],
    description: 'Custom CNC aluminum differential-drive robot running real-time 3D SLAM, obstacle avoidance, and waypoint following on NVIDIA Jetson Orin Nano.',
    repoUrl: 'https://github.com/traic-club/autonomous-ugv',
    demoUrl: '',
    modelUrl: '',
    featured: true,
  },
  {
    slug: 'edge-neural-pcb',
    title: 'Edge Neural Accelerator Board',
    tagline: 'Custom 4-layer PCB running quantized edge vision models on STM32H7 and Hailo-8 NPU.',
    category: 'HARDWARE',
    year: 2024,
    tech: ['KiCad', 'STM32', 'C', 'FreeRTOS', 'Hailo-8', 'Altium'],
    description: 'High-speed differential routing, power sequencing, and camera interfaces on a custom 4-layer FR4 board for low-power edge detection.',
    repoUrl: 'https://github.com/traic-club/edge-neural-pcb',
    demoUrl: '',
    modelUrl: '',
    featured: true,
  },
  {
    slug: 'telemetry-ground-station',
    title: 'Distributed Telemetry Ground Station',
    tagline: 'Sub-millisecond WebSockets and WebRTC ground station platform for live robotic fleet telemetry.',
    category: 'SOFTWARE',
    year: 2024,
    tech: ['Rust', 'Go', 'Next.js', 'WebSockets', 'LoRa', 'Three.js'],
    description: 'Decodes RF packets from rovers and drones in real time, rendering low-latency 3D orientation models, battery thermals, and sensor graphs.',
    repoUrl: 'https://github.com/traic-club/telemetry-station',
    demoUrl: '',
    modelUrl: '',
    featured: true,
  }
];

export default async function ProjectsPage() {
  let projects = [];

  try {
    const res = await fetch(`${API_BASE}/public/projects`, {
      next: { tags: ['projects'] }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        projects = json.data.map((p: any) => ({
          slug: p.slug,
          title: p.title,
          tagline: p.tagline,
          category: p.category,
          year: p.year || 2024,
          tech: p.techStack || p.tech || [],
          description: p.descriptionMd || p.description,
          repoUrl: p.repoUrl || 'https://github.com/traic-club',
          demoUrl: p.demoUrl || '',
          modelUrl: p.model3dAssetUrl || '',
          featured: !!p.featured,
        }));
      }
    }
  } catch (err) {
    console.warn(`[WARN] Backend offline: Failed to fetch /public/projects. Falling back to default data.`);
  }

  if (projects.length === 0) {
    projects = FALLBACK_PROJECTS;
  }

  return <ClientProjects initialProjects={projects} />;
}
