# 04 — Dynamic Admin CMS & The Ingri World Architecture Specification

## 1. Architectural Lessons from Ingri World (`Aarish1915/ingri`)

In **Ingri World**, the architecture achieved 100% decoupling between frontend presentation and backend administration:
1. **Decoupled Dedicated Admin Panel**:
   - The admin panel operates as an independent, isolated React application on its own subdomain, with stricter Content Security Policies and zero bundle bleed into the public site.
2. **Zero Hardcoded Copy (Dynamic CMS Paradigm)**:
   - In Ingri World, delivery pincodes, dynamic hero banners, product variations, inventory thresholds, and announcement notices were completely pulled from database tables. No redeployments were needed when business parameters changed.
3. **Optimistic Concurrency & Safe State Mutations**:
   - Status transitions (e.g. `Order: PENDING -> CONFIRMED -> SHIPPED` or `Application: SUBMITTED -> REVIEWING -> SHORTLISTED`) execute via parameterized database queries with immediate in-memory cache invalidation.
4. **Rich Entity Management with Media References**:
   - Admin components support direct CDN image URLs, category pills, priority ordering, search filtering, and single-click visibility toggles (`QuickVisibilityToggle`).

---

## 2. Complete Dynamic Content Schema for TRAIC Platform

Every single string, heading, paragraph, counter, equipment item, and section toggle that appears on the public website must be stored in the database and manageable via the Admin Console:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      ADMIN DYNAMIC CMS MAPPING                         │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Website Section          │ Database Entity & Dynamic Fields            │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Global Announcement Bar  │ Banner: type, title, message, url, active   │
│ Navbar Header            │ Settings: siteTitle, mottoText, joinOpen    │
│ Hero Section             │ Settings: heroHeadline, heroSubtitle, CTAs  │
│ Metric Stats Bar         │ Settings: stats (Years, Projects, Awards)   │
│ Section Feature Flags    │ Settings: enabledSections (Gear, Stats, etc)│
│ Featured Projects        │ Project: title, tagline, 3D glb, BOM, spec  │
│ Workshop Lab Equipment   │ LabGear: name, model, category, specs, stat │
│ Research Tracks          │ Track: title, description, lead, icon       │
│ Field Dispatches/Photos  │ GalleryItem: title, category, date, url     │
│ Awards & Achievements    │ Achievement: title, eventName, rank, level  │
│ Events & Workshops       │ Event: title, location, startsAt, rsvpUrl   │
│ Team & Alumni Network    │ Member / Alumni: role, company, bio, social │
│ Recruitment Applications │ JoinApplication: track, answers, reviewStat │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 3. Comprehensive Dynamic Endpoints Specification

### A. Site Configuration & Homepage Content (`/api/settings`)
* **`GET /public/settings`**: Returns public site configuration.
* **`PUT /admin/settings`**: Updates global website configuration.

#### Data Schema (`SiteSetting`):
```typescript
export interface SiteSetting {
  id: string;
  siteName: string;            // e.g. "TRAIC"
  mottoText: string;           // e.g. "HONOR • HONESTY • SACRIFICE"
  showMotto: boolean;          // Toggle creed visibility
  heroHeadline: string;        // e.g. "Where Hardware Meets Autonomous Intelligence"
  heroSubtitle: string;        // Dynamic mission statement paragraph
  heroPrimaryCtaText: string;  // e.g. "Explore Projects"
  heroPrimaryCtaUrl: string;   // e.g. "/projects"
  heroSecondaryCtaText: string;// e.g. "Join 2025 Cohort"
  heroSecondaryCtaUrl: string; // e.g. "/join"
  announcementText?: string;   // Quick header notification
  announcementUrl?: string;
  stats: {
    yearsActive: number;       // e.g. 5
    yearsActiveLabel: string;  // e.g. "Years of Engineering"
    projectsBuilt: number;     // e.g. 42
    projectsBuiltLabel: string;// e.g. "Hardware & AI Systems"
    awardsWon: number;         // e.g. 28
    awardsWonLabel: string;    // e.g. "National Hackathons Won"
    activeMembers: number;     // e.g. 95
    activeMembersLabel: string;// e.g. "Active Student Builders"
  };
  sectionToggles: {
    showStatsCounter: boolean;
    showFeaturedProjects: boolean;
    showLabEquipment: boolean;
    showAchievements: boolean;
    showFieldDispatches: boolean;
    showRecruitmentBanner: boolean;
  };
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  discordUrl?: string;
  labLocation: string;         // e.g. "Advanced Robotics Lab, Block C-302, COER University"
}
```

---

### B. Workshop & Lab Equipment (`/api/gear`)
Currently hardcoded in `page.tsx`, this will become a fully dynamic collection:
* **`GET /public/gear`**: Returns active lab equipment for the homepage workshop section.
* **`POST /admin/gear`**: Add new oscilloscope, 3D printer, or soldering station.
* **`PUT /admin/gear/:id`**: Update specifications, operational status, or manual.
* **`DELETE /admin/gear/:id`**: Retire equipment.

#### Data Schema (`LabGear`):
```typescript
export interface LabGear {
  id: string;
  name: string;                // e.g. "Mixed Signal Oscilloscope"
  model: string;               // e.g. "Rigol DS1054Z / 100MHz 4-CH"
  category: 'TESTING' | 'SOLDERING' | 'FABRICATION' | 'COMPUTE' | 'ROBOTICS';
  specifications: string;      // e.g. "4 Channels, 1GSa/s, SPI/I2C/UART decoders"
  status: 'OPERATIONAL' | 'IN_USE' | 'MAINTENANCE';
  imageUrl?: string;
  priority: number;            // Display order
  isPublished: boolean;
}
```

---

### C. Projects & Real 3D Hardware CAD Assets (`/api/projects`)
* **`GET /public/projects`**: Lists published projects with optional track/year filter.
* **`GET /public/projects/:slug`**: Full technical specification page with BOM and 3D preview.
* **`POST /admin/projects`**: Create new engineering project.
* **`PUT /admin/projects/:id`**: Edit project metadata, CAD asset URL, and BOM.
* **`PATCH /admin/projects/:id/visibility`**: Single-click draft/published toggle.

#### Extended Bill of Materials (BOM) Schema:
```typescript
export interface BomItem {
  component: string;           // e.g. "Microcontroller"
  partNumber: string;          // e.g. "STM32H743ZIT6"
  function: string;            // e.g. "Main ROS2 compute node"
  datasheetUrl?: string;
}
```

---

### D. Announcements & Multi-Banners (`/api/banners`)
* Supports high-priority alerts with dynamic styling (`URGENT` red, `EVENT` blue, `ACHIEVEMENT` green, `ANNOUNCEMENT` cyan).
* Single-click toggle in admin instantly activates or dismisses the top alert banner on all public pages.

---

### E. Field Dispatches & Photography (`/api/gallery`)
* Dynamic upload and cataloging of real lab photos, robot field trials, competition arenas, and PCB assembly.
* `featured` flag automatically spotlights the item on the homepage photo grid.
