import { ClientTeam, TeamMember } from './ClientTeam';

export const revalidate = 60; // ISR cache

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const DEFAULT_LEADERSHIP: TeamMember[] = [
  {
    name: 'Aarish Ali',
    role: 'Lead Coordinator & Robotics Architect',
    category: 'LEADERSHIP',
    domain: 'Robotics & Firmware',
    academicYear: 'Class of 2025',
    bio: 'Directs overall club technical roadmaps, high-speed PCB fabrication, RTOS firmware development, and autonomous vehicle integration at DIA Labs.',
    skills: ['ROS2', 'STM32H7', 'FreeRTOS', 'KiCad', 'CAN-FD', 'SLAM'],
    initials: 'AA',
    projects: [
      { title: 'Pipeline Inspection Rover', slug: 'pipeline-inspection-rover' },
      { title: 'Autonomous UGV Platform', slug: 'autonomous-ugv-platform' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Rohan Sharma',
    role: 'Co-Coordinator & Edge AI Systems Lead',
    category: 'LEADERSHIP',
    domain: 'Edge AI & Navigation',
    academicYear: 'Class of 2025',
    bio: 'Specializes in 3D LiDAR point-cloud SLAM, RTAB-Map real-time loop closure, and TensorRT neural quantization on NVIDIA Jetson embedded silicon.',
    skills: ['PyTorch', 'TensorRT', 'LiDAR SLAM', 'C++', 'OpenCV', 'Hailo-8'],
    initials: 'RS',
    projects: [
      { title: 'Pipeline Inspection Rover', slug: 'pipeline-inspection-rover' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

const DEFAULT_DOMAIN_LEADS: TeamMember[] = [
  {
    name: 'Vikram Mehta',
    role: 'Mechanical Fabrication & CAD Lead',
    category: 'DOMAIN_LEAD',
    domain: 'Mechatronics & CAD',
    academicYear: 'Class of 2025',
    bio: 'Precision CNC isolation routing, 6061-T6 aluminum milling, and structural stress-optimized 3D printed mechanical enclosures.',
    skills: ['SolidWorks', 'CNC Machining', 'FEA Analysis', 'Bambu Lab X1C'],
    initials: 'VM',
  },
  {
    name: 'Aarav Kapoor',
    role: 'Embedded Firmware & RTOS Lead',
    category: 'DOMAIN_LEAD',
    domain: 'Embedded Systems',
    academicYear: 'Class of 2026',
    bio: 'Bare-metal C on ARM Cortex-M7, DMA circular ring buffers, and deterministically timed motor control PID loops.',
    skills: ['ARM Cortex-M7', 'STM32CubeIDE', 'Saleae Logic', 'Bare-Metal C'],
    initials: 'AK',
  },
  {
    name: 'Ananya Verma',
    role: 'Hardware & Multi-layer PCB Lead',
    category: 'DOMAIN_LEAD',
    domain: 'PCB Engineering',
    academicYear: 'Class of 2026',
    bio: '4-layer controlled impedance routing, ground plane return paths, and hot-air SMD reflow down to 0402 packages.',
    skills: ['KiCad 8', 'High-Speed Routing', 'SMD Reflow', 'DRC Rules'],
    initials: 'AV',
  },
  {
    name: 'Devansh Saxena',
    role: 'Systems & Infrastructure Lead',
    category: 'DOMAIN_LEAD',
    domain: 'Self-Hosted Systems',
    academicYear: 'Class of 2026',
    bio: 'Proxmox VE virtualization, ZFS RAID-Z2 storage arrays, Forgejo Git mirroring, and private local LLM inference engines.',
    skills: ['Linux', 'Proxmox', 'Docker', 'WireGuard', 'vLLM', 'ZFS'],
    initials: 'DS',
  },
  {
    name: 'Pooja Rawat',
    role: 'Lab Operations & Logistics Lead',
    category: 'DOMAIN_LEAD',
    domain: 'Operations',
    academicYear: 'Class of 2026',
    bio: 'Manages DIA Labs bench safety protocols, component procurement, inventory tracking, and national competition logistics.',
    skills: ['Lab Safety', 'Procurement', 'BOM Auditing', 'Event Management'],
    initials: 'PR',
  },
];

const DEFAULT_MEMBERS: TeamMember[] = [
  { name: 'Kunal Joshi', role: 'Builder', category: 'MEMBER', domain: 'Embedded Systems', academicYear: 'Class of 2027', bio: '', skills: ['STM32', 'C', 'I2C'], initials: 'KJ' },
  { name: 'Sneha Bisht', role: 'Builder', category: 'MEMBER', domain: 'Computer Vision', academicYear: 'Class of 2027', bio: '', skills: ['Python', 'OpenCV', 'ROS2'], initials: 'SB' },
  { name: 'Aditya Chauhan', role: 'Builder', category: 'MEMBER', domain: 'PCB Design', academicYear: 'Class of 2027', bio: '', skills: ['KiCad', 'Soldering'], initials: 'AC' },
  { name: 'Priya Sharma', role: 'Builder', category: 'MEMBER', domain: 'CAD & 3D Print', academicYear: 'Class of 2027', bio: '', skills: ['Fusion360', 'Slicing'], initials: 'PS' },
  { name: 'Harshit Negi', role: 'Builder', category: 'MEMBER', domain: 'Firmware', academicYear: 'Class of 2027', bio: '', skills: ['C++', 'FreeRTOS'], initials: 'HN' },
  { name: 'Ritu Pandey', role: 'Builder', category: 'MEMBER', domain: 'Robotics', academicYear: 'Class of 2027', bio: '', skills: ['Kinematics', 'URDF'], initials: 'RP' },
  { name: 'Manish Tyagi', role: 'Builder', category: 'MEMBER', domain: 'Self-Host', academicYear: 'Class of 2027', bio: '', skills: ['Linux', 'Docker'], initials: 'MT' },
  { name: 'Tanvi Kashyap', role: 'Builder', category: 'MEMBER', domain: 'Embedded Systems', academicYear: 'Class of 2027', bio: '', skills: ['CAN-FD', 'UART'], initials: 'TK' },
];

export default async function TeamPage() {
  let leadership = DEFAULT_LEADERSHIP;
  let domainLeads = DEFAULT_DOMAIN_LEADS;
  let activeMembers = DEFAULT_MEMBERS;

  try {
    const res = await fetch(`${API_BASE}/public/team`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        const raw = json.data;
        const coords = raw.filter((m: any) => m.position === 'COORDINATOR' || m.position === 'CO_COORDINATOR' || m.category === 'LEADERSHIP');
        const leads = raw.filter((m: any) => m.position === 'LEAD' || m.category === 'DOMAIN_LEAD');
        const members = raw.filter((m: any) => m.position === 'MEMBER' || (!coords.includes(m) && !leads.includes(m)));

        const formatMember = (m: any, defaultCat: 'LEADERSHIP' | 'DOMAIN_LEAD' | 'MEMBER'): TeamMember => ({
          name: m.name,
          role: m.role || m.position || 'Builder',
          category: (m.category || defaultCat) as 'LEADERSHIP' | 'DOMAIN_LEAD' | 'MEMBER',
          domain: m.domain || 'Engineering',
          academicYear: m.academicYear || 'Class of 2026',
          bio: m.bio || '',
          skills: m.skills || [],
          avatar: m.avatar || m.photoUrl,
          initials: m.name ? m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'TR',
          github: m.github || m.socials?.github,
          linkedin: m.linkedin || m.socials?.linkedin,
          projects: m.projects,
        });

        if (coords.length > 0) leadership = coords.map((m: any) => formatMember(m, 'LEADERSHIP'));
        if (leads.length > 0) domainLeads = leads.map((m: any) => formatMember(m, 'DOMAIN_LEAD'));
        if (members.length > 0) activeMembers = members.map((m: any) => formatMember(m, 'MEMBER'));
      }
    }
  } catch (err) {
    // Graceful fallback to default leadership and leads
  }

  return (
    <ClientTeam
      leadership={leadership}
      domainLeads={domainLeads}
      activeMembers={activeMembers}
    />
  );
}
