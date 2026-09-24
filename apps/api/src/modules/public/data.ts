import type {
  Project,
  Achievement,
  Event,
  Member,
  Alumni,
  Track,
  SiteSetting,
  JoinApplication,
  ContactMessage,
  Banner,
  GalleryItem,
} from '@traic/shared';
import crypto from 'node:crypto';

// Initial seed states
const initialProjects: Project[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    slug: 'autonomous-ugv-rover',
    title: 'Autonomous Field Rover (UGV-X)',
    tagline: 'All-terrain autonomous rover equipped with LiDAR, stereo depth cameras, and ROS2 navigation.',
    descriptionMd: 'Built from custom CNC aluminum chassis, brushless hub motors, and powered by NVIDIA Jetson Orin Nano running RTAB-Map SLAM and custom path planning algorithms for GPS-denied environments.',
    category: 'HYBRID',
    year: 2024,
    techStack: ['ROS2', 'C++', 'Python', 'RTAB-Map', 'LiDAR', 'CAN Bus', 'NVIDIA Jetson'],
    repoUrl: 'https://github.com/traic-club/autonomous-ugv',
    demoUrl: '',
    featured: true,
    posterAssetUrl: '/images/projects/rover.webp',
    model3dAssetUrl: '',
    team: [
      { name: 'Aarish Ali', roleInProject: 'Embedded & Firmware Lead' },
      { name: 'Rohan Sharma', roleInProject: 'Computer Vision & Navigation' },
    ],
    status: 'PUBLISHED',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    slug: 'edge-neural-pcb',
    title: 'Edge Neural Accelerator Board',
    tagline: 'Custom 4-layer PCB running quantized edge vision models on STM32H7 and Hailo-8 NPU.',
    descriptionMd: 'An ultra-low-power edge computing module designed in KiCad, featuring high-speed differential pairs, onboard thermal regulation, and dual MIPI-CSI camera interfaces.',
    category: 'HARDWARE',
    year: 2024,
    techStack: ['KiCad', 'STM32', 'C', 'FreeRTOS', 'Hailo-8', 'Altium'],
    repoUrl: 'https://github.com/traic-club/edge-neural-pcb',
    demoUrl: '',
    featured: true,
    posterAssetUrl: '/images/projects/pcb.webp',
    model3dAssetUrl: '',
    team: [
      { name: 'Priya Patel', roleInProject: 'Hardware Design & Routing' },
      { name: 'Vikram Mehta', roleInProject: 'Firmware & HAL' },
    ],
    status: 'PUBLISHED',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    slug: 'telemetry-ground-station',
    title: 'Distributed Telemetry Ground Station',
    tagline: 'Sub-millisecond WebSockets and WebRTC ground station platform for live robotic fleet telemetry.',
    descriptionMd: 'Full-stack distributed system built with Go, Rust, and Next.js, decoding LoRa 868MHz and RF telemetry packets into low-latency WebGL 3D orientation visualizers.',
    category: 'SOFTWARE',
    year: 2024,
    techStack: ['Rust', 'Go', 'Next.js', 'WebSockets', 'LoRa', 'Three.js'],
    repoUrl: 'https://github.com/traic-club/telemetry-station',
    demoUrl: '',
    featured: true,
    posterAssetUrl: '/images/projects/telemetry.webp',
    model3dAssetUrl: '',
    team: [
      { name: 'Kavya Nair', roleInProject: 'Distributed Backend Lead' },
      { name: 'Arjun Das', roleInProject: '3D Telemetry UI' },
    ],
    status: 'PUBLISHED',
  },
];

const initialAchievements: Achievement[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    title: 'National Champions — Hardware Edition',
    eventName: 'Smart India Hackathon (Hardware Edition)',
    level: 'NATIONAL',
    rank: '1st Prize / Winners',
    date: '2024-12-19',
    certificateAssetUrl: '',
    photos: [],
    status: 'PUBLISHED',
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    title: 'Best Engineering Design Award',
    eventName: 'DD Robocon India',
    level: 'NATIONAL',
    rank: 'AIR 4 / Design Excellence',
    date: '2024-06-25',
    certificateAssetUrl: '',
    photos: [],
    status: 'PUBLISHED',
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    title: '1st Runners-Up: Autonomous Robotics Track',
    eventName: 'IIT Bombay Techfest Autonomous Challenge',
    level: 'NATIONAL',
    rank: '2nd Prize',
    date: '2023-12-28',
    certificateAssetUrl: '',
    photos: [],
    status: 'PUBLISHED',
  },
];

const initialEvents: Event[] = [
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    slug: 'robotics-and-ros2-bootcamp-2025',
    title: 'Robotics, ROS2 & Embedded Bootcamp 2025',
    tagline: 'From Microcontrollers to Autonomous Navigation in 4 intensive weekend sprints.',
    descriptionMd: 'Hands-on bootcamp where participants build a miniature differential-drive robot, program motor controllers in C/FreeRTOS, and implement sensor fusion with ROS2 on Linux SBCs.',
    type: 'Bootcamp',
    mode: 'OFFLINE',
    venue: 'TRAIC Innovation Lab, Block 4, Ground Floor',
    startsAt: '2025-10-15T10:00:00.000Z',
    endsAt: '2025-10-16T18:00:00.000Z',
    registerUrl: 'https://forms.gle/traic-bootcamp-2025',
    bannerAssetUrl: '/images/events/bootcamp.webp',
    photos: [],
    status: 'PUBLISHED',
  },
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    slug: 'traic-annual-hardware-hackathon-2025',
    title: 'TRAIC InnoHacks: 36-Hour Hardware Sprint',
    tagline: 'Build working physical prototypes from components provided on the spot.',
    descriptionMd: '36-hour physical hackathon featuring microcontrollers, sensors, 3D printers, laser cutters, and oscilloscope stations. Mentors from top industry hardware labs.',
    type: 'Hackathon',
    mode: 'OFFLINE',
    venue: 'Central Auditorium & Maker Space',
    startsAt: '2025-11-20T09:00:00.000Z',
    endsAt: '2025-11-21T21:00:00.000Z',
    registerUrl: '/events/traic-annual-hardware-hackathon-2025',
    bannerAssetUrl: '/images/events/innohacks.webp',
    photos: [],
    status: 'PUBLISHED',
  },
];

const initialMembers: Member[] = [
  {
    id: 'm1111111-1111-1111-1111-111111111111',
    name: 'Aarish Ali',
    photoUrl: '/images/team/aarish.webp',
    bio: 'Lead Coordinator & Robotics Architect. Specializes in embedded firmware, high-speed PCB design, and ROS2 robot locomotion.',
    socials: {
      github: 'https://github.com/Aarish1915',
      linkedin: 'https://linkedin.com/in/aarishali',
      portfolio: '',
    },
    position: 'COORDINATOR',
    academicYear: '2024-2025',
    isCurrent: true,
    order: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'm2222222-2222-2222-2222-222222222222',
    name: 'Ananya Verma',
    photoUrl: '/images/team/ananya.webp',
    bio: 'Co-Coordinator & AI Lead. Researching transformer-based spatial awareness and edge-quantized vision models.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      portfolio: '',
    },
    position: 'CO_COORDINATOR',
    academicYear: '2024-2025',
    isCurrent: true,
    order: 2,
    status: 'PUBLISHED',
  },
];

const initialAlumni: Alumni[] = [
  {
    id: 'al111111-1111-1111-1111-111111111111',
    name: 'Devansh K.',
    batch: '2023',
    currentRole: 'Robotics Software Engineer',
    company: 'Leading Autonomous Vehicle Startup',
    quote: 'TRAIC gave me the experience of debugging real motor jitter and hardware faults that no lecture hall could teach.',
    consentAt: '2024-01-10T10:00:00.000Z',
    status: 'PUBLISHED',
  },
  {
    id: 'al222222-2222-2222-2222-222222222222',
    name: 'Tanvi M.',
    batch: '2022',
    currentRole: 'Silicon Validation Engineer',
    company: 'Global Semiconductor Corp',
    quote: 'Designing real PCBs and probing them with oscilloscopes in TRAIC directly landed me my core hardware role.',
    consentAt: '2024-02-15T10:00:00.000Z',
    status: 'PUBLISHED',
  },
];

const initialTracks: Track[] = [
  {
    id: 't1111111-1111-1111-1111-111111111111',
    slug: 'robotics-and-hardware',
    title: 'Robotics & Hardware Systems',
    summary: 'Master schematic capture, multi-layer PCB design, motor dynamics, and industrial bus protocols (CAN, UART, SPI, I2C).',
    level: 'FOUNDATION',
    tools: ['KiCad', 'Altium', 'FreeCAD', 'Oscilloscopes', 'Soldering Stations', 'CAN Analyzers'],
    outcomes: [
      'Design, fabricate, and assemble 2-4 layer PCBs',
      'Select and size BLDC/stepper motors and driver circuits',
      'Integrate power regulation and safety cutoffs',
    ],
    modules: [],
    order: 1,
  },
  {
    id: 't2222222-2222-2222-2222-222222222222',
    slug: 'embedded-firmware-and-iot',
    title: 'Embedded Firmware & RTOS',
    summary: 'Write production-grade bare-metal and FreeRTOS firmware in modern C/C++ and Rust for ARM Cortex-M and ESP32 targets.',
    level: 'INTERMEDIATE',
    tools: ['STM32CubeIDE', 'FreeRTOS', 'ESP-IDF', 'Rust Embedded', 'Logic Analyzers'],
    outcomes: [
      'Write deterministic multi-threaded tasks on FreeRTOS',
      'Implement DMA-driven serial communication without CPU stalls',
      'Secure over-the-air (OTA) updates and flash encryption',
    ],
    modules: [],
    order: 2,
  },
  {
    id: 't3333333-3333-3333-3333-333333333333',
    slug: 'ros2-and-edge-ai',
    title: 'ROS2 & Autonomous Navigation',
    summary: 'Develop autonomous mobile robot pipelines: sensor fusion, 2D/3D SLAM, obstacle avoidance, and edge neural inference.',
    level: 'ADVANCED',
    tools: ['ROS2 Humble/Iron', 'Nav2', 'Gazebo', 'RTAB-Map', 'NVIDIA Jetson', 'PyTorch'],
    outcomes: [
      'Deploy full Nav2 autonomous waypoint navigation',
      'Fuse IMU, wheel odometry, and LiDAR via Extended Kalman Filter',
      'Quantize and deploy INT8 computer vision models to edge accelerators',
    ],
    modules: [],
    order: 3,
  },
];

const initialSettings: SiteSetting = {
  clubName: 'TRAIC',
  tagline: 'Technology, Robotics & AI Community',
  heroHeadline: 'Where Physical Hardware Meets Intelligent Code',
  heroSubheadline: 'We are a premier college community designing custom PCBs, programming autonomous robots, and deploying edge AI systems that win national competitions.',
  announcement: {
    enabled: true,
    text: 'Applications for 2025 Cohort are now open! Join the hardware & software tracks.',
    linkUrl: '/join',
    linkText: 'Apply Now',
  },
  stats: {
    yearsActive: 5,
    projectsBuilt: 42,
    awardsWon: 28,
    activeMembers: 95,
  },
  socials: {
    github: 'https://github.com/Aarish1915/Traic',
    linkedin: 'https://linkedin.com/company/traic',
    instagram: 'https://instagram.com/traic_club',
    youtube: 'https://youtube.com/@traic',
    discord: 'https://discord.gg/traic',
  },
};

const initialBanners: Banner[] = [
  {
    id: 'bbbbbbbb-1111-1111-1111-111111111111',
    title: '2025 Engineering Cohort Live',
    message: 'Applications for the 2025 Hardware & AI Engineering Cohort are now open!',
    linkUrl: '/join',
    linkText: 'Apply Now',
    type: 'ANNOUNCEMENT',
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bbbbbbbb-2222-2222-2222-222222222222',
    title: 'TRAIC InnoHacks Flagship Event',
    message: '36-Hour Physical Hardware & Robotics Hackathon is scheduled for this November.',
    linkUrl: '/events',
    linkText: 'Event Details',
    type: 'EVENT',
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString(),
  },
];

const initialGallery: GalleryItem[] = [
  {
    id: 'g1111111-1111-1111-1111-111111111111',
    title: 'Smart India Hackathon Grand Finale Winners',
    caption: 'TRAIC Autonomous Pipeline Crawler team receiving the 1st prize trophy at the national grand finale after 36 hours of continuous live judging.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    category: 'COMPETITION',
    date: 'Dec 2024',
    location: 'National Grand Finale Stage',
    featured: true,
    projectSlug: 'autonomous-ugv-rover',
  },
  {
    id: 'g2222222-2222-2222-2222-222222222222',
    title: 'High-Speed CNC Aluminum Chassis Milling',
    caption: 'Machining custom 6061-T6 aluminum differential wheel hubs and motor mounts for the UGV-X terrain rover.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    category: 'FABRICATION',
    date: 'Oct 2024',
    location: 'TRAIC Workshop CNC Bay',
    featured: true,
  },
  {
    id: 'g3333333-3333-3333-3333-333333333333',
    title: 'SMD Micro-Soldering & Thermal Profiling',
    caption: 'Probing 0.4mm pitch QFN pins and power sequencing rails on the Edge Neural Accelerator 4-layer prototype board.',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80',
    category: 'LAB_LIFE',
    date: 'Aug 2024',
    location: 'Electronics Probing Station 03',
    featured: true,
    projectSlug: 'edge-neural-pcb',
  },
  {
    id: 'g4444444-4444-4444-4444-444444444444',
    title: 'Outdoor Autonomous Rover Field Trials',
    caption: 'Field testing RTAB-Map 3D LiDAR SLAM in GPS-denied rough outdoor terrain with live WebSockets telemetry uplink.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    category: 'ROBOTICS',
    date: 'Sep 2024',
    location: 'Campus Botanical Dirt Track',
    featured: true,
    projectSlug: 'autonomous-ugv-rover',
  },
  {
    id: 'g5555555-5555-5555-5555-555555555555',
    title: 'DD Robocon Arena Match Simulation',
    caption: 'Holonomic Mecanum platform executing high-speed trajectory sequences and pneumatic ball ejector firing under 5mm repeatability.',
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
    category: 'COMPETITION',
    date: 'Jun 2024',
    location: 'National Robocon Arena, Pune',
    featured: true,
    projectSlug: 'robocon-holonomic-base',
  },
  {
    id: 'g6666666-6666-6666-6666-666666666666',
    title: 'Freshman Hands-On STM32 Bootcamp',
    caption: 'Seniors mentoring 1st and 2nd year students on bare-metal register configuration, GPIO interrupts, and oscilloscope signal debugging.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    category: 'WORKSHOP',
    date: 'Feb 2024',
    location: 'Innovation Lab 402',
    featured: false,
  },
];

class DataStore {
  public projects: Project[] = [...initialProjects];
  public achievements: Achievement[] = [...initialAchievements];
  public events: Event[] = [...initialEvents];
  public members: Member[] = [...initialMembers];
  public alumni: Alumni[] = [...initialAlumni];
  public tracks: Track[] = [...initialTracks];
  public banners: Banner[] = [...initialBanners];
  public gallery: GalleryItem[] = [...initialGallery];
  public settings: SiteSetting = { ...initialSettings };
  public applications: JoinApplication[] = [];
  public messages: ContactMessage[] = [];

  // Projects CRUD
  getProjects() {
    return this.projects;
  }
  getProjectById(id: string) {
    return this.projects.find((p) => p.id === id);
  }
  getProjectBySlug(slug: string) {
    return this.projects.find((p) => p.slug === slug);
  }
  createProject(data: Omit<Project, 'id'>) {
    const newProject: Project = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.unshift(newProject);
    return newProject;
  }
  updateProject(id: string, data: Partial<Project>) {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = {
      ...this.projects[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.projects[idx];
  }
  deleteProject(id: string) {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.projects.splice(idx, 1);
    return true;
  }

  // Events CRUD
  getEvents() {
    return this.events;
  }
  getEventById(id: string) {
    return this.events.find((e) => e.id === id);
  }
  getEventBySlug(slug: string) {
    return this.events.find((e) => e.slug === slug);
  }
  createEvent(data: Omit<Event, 'id'>) {
    const newEvent: Event = {
      ...data,
      id: crypto.randomUUID(),
    };
    this.events.unshift(newEvent);
    return newEvent;
  }
  updateEvent(id: string, data: Partial<Event>) {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.events[idx] = { ...this.events[idx], ...data };
    return this.events[idx];
  }
  deleteEvent(id: string) {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.events.splice(idx, 1);
    return true;
  }

  // Achievements CRUD
  getAchievements() {
    return this.achievements;
  }
  createAchievement(data: Omit<Achievement, 'id'>) {
    const newAch: Achievement = {
      ...data,
      id: crypto.randomUUID(),
    };
    this.achievements.unshift(newAch);
    return newAch;
  }
  updateAchievement(id: string, data: Partial<Achievement>) {
    const idx = this.achievements.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.achievements[idx] = { ...this.achievements[idx], ...data };
    return this.achievements[idx];
  }
  deleteAchievement(id: string) {
    const idx = this.achievements.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.achievements.splice(idx, 1);
    return true;
  }

  // Members CRUD
  getMembers() {
    return this.members;
  }
  createMember(data: Omit<Member, 'id'>) {
    const newMember: Member = {
      ...data,
      id: crypto.randomUUID(),
    };
    this.members.push(newMember);
    return newMember;
  }
  updateMember(id: string, data: Partial<Member>) {
    const idx = this.members.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.members[idx] = { ...this.members[idx], ...data };
    return this.members[idx];
  }
  deleteMember(id: string) {
    const idx = this.members.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    this.members.splice(idx, 1);
    return true;
  }

  // Alumni CRUD
  getAlumni() {
    return this.alumni;
  }
  createAlumni(data: Omit<Alumni, 'id'>) {
    const newAlumni: Alumni = {
      ...data,
      id: crypto.randomUUID(),
    };
    this.alumni.unshift(newAlumni);
    return newAlumni;
  }
  updateAlumni(id: string, data: Partial<Alumni>) {
    const idx = this.alumni.findIndex((al) => al.id === id);
    if (idx === -1) return null;
    this.alumni[idx] = { ...this.alumni[idx], ...data };
    return this.alumni[idx];
  }
  deleteAlumni(id: string) {
    const idx = this.alumni.findIndex((al) => al.id === id);
    if (idx === -1) return false;
    this.alumni.splice(idx, 1);
    return true;
  }

  // Settings
  getSettings() {
    return this.settings;
  }
  updateSettings(data: Partial<SiteSetting>) {
    this.settings = {
      ...this.settings,
      ...data,
      stats: data.stats ? { ...this.settings.stats, ...data.stats } : this.settings.stats,
      announcement: data.announcement
        ? { ...this.settings.announcement, ...data.announcement }
        : this.settings.announcement,
      socials: data.socials ? { ...this.settings.socials, ...data.socials } : this.settings.socials,
    };
    return this.settings;
  }

  // Applications
  getApplications() {
    return this.applications;
  }
  addApplication(app: Omit<JoinApplication, 'id' | 'createdAt'>) {
    const newApp: JoinApplication = {
      ...app,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.applications.unshift(newApp);
    return newApp;
  }

  // Banners CRUD
  getBanners(onlyActive = false) {
    if (onlyActive) {
      return this.banners.filter((b) => b.isActive);
    }
    return this.banners;
  }
  createBanner(banner: Omit<Banner, 'id' | 'createdAt'>) {
    const newBanner: Banner = {
      ...banner,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.banners.unshift(newBanner);
    return newBanner;
  }
  updateBanner(id: string, data: Partial<Banner>) {
    const idx = this.banners.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.banners[idx] = { ...this.banners[idx], ...data };
    return this.banners[idx];
  }
  deleteBanner(id: string) {
    const idx = this.banners.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.banners.splice(idx, 1);
    return true;
  }

  // Gallery CRUD
  getGallery() {
    return this.gallery;
  }
  createGalleryItem(data: Omit<GalleryItem, 'id'>) {
    const item: GalleryItem = {
      ...data,
      id: crypto.randomUUID(),
    };
    this.gallery.unshift(item);
    return item;
  }
  updateGalleryItem(id: string, data: Partial<GalleryItem>) {
    const idx = this.gallery.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    this.gallery[idx] = { ...this.gallery[idx], ...data };
    return this.gallery[idx];
  }
  deleteGalleryItem(id: string) {
    const idx = this.gallery.findIndex((g) => g.id === id);
    if (idx === -1) return false;
    this.gallery.splice(idx, 1);
    return true;
  }

  // Messages
  getMessages() {
    return this.messages;
  }
  addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt'>) {
    const newMsg: ContactMessage = {
      ...msg,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.messages.unshift(newMsg);
    return newMsg;
  }
}

export const store = new DataStore();

// Backwards compatibility aliases
export const seedProjects = store.projects;
export const seedAchievements = store.achievements;
export const seedEvents = store.events;
export const seedMembers = store.members;
export const seedTracks = store.tracks;
export const seedSettings = store.settings;
