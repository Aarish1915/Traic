import { Router } from 'express';
import {
  ProjectSchema,
  EventSchema,
  AchievementSchema,
  MemberSchema,
  AlumniSchema,
  SiteSettingSchema,
  BannerSchema,
  GalleryItemSchema,
  LabGearSchema,
} from '@traic/shared';
import { store } from '../public/data';
import { NotFoundError, ValidationError } from '../../common/errors';
import { logger } from '../../common/logger';
import {
  requireAdminAuth,
  checkBruteForceLock,
  handleLogin,
  handleLogout,
  handleVerify,
} from './auth';

export const adminRouter = Router();

// Authentication endpoints
adminRouter.post('/admin/auth/login', checkBruteForceLock, handleLogin);
adminRouter.post('/admin/auth/logout', handleLogout);
adminRouter.get('/admin/auth/verify', handleVerify);

// Enforce authentication on all administrative mutations and queries
adminRouter.use('/admin', requireAdminAuth);

// Overview stats
adminRouter.get('/admin/stats', (_req, res) => {
  res.json({
    success: true,
    data: {
      totalProjects: store.getProjects().length,
      totalEvents: store.getEvents().length,
      totalAchievements: store.getAchievements().length,
      totalMembers: store.getMembers().length,
      totalAlumni: store.getAlumni().length,
      totalApplications: store.getApplications().length,
      announcementActive: Boolean(store.getSettings().announcement?.enabled),
    },
  });
});

// PROJECTS CRUD
adminRouter.get('/admin/projects', (_req, res) => {
  res.json({ success: true, data: store.getProjects(false) });
});

adminRouter.post('/admin/projects', (req, res, next) => {
  const parsed = ProjectSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid project payload', parsed.error.flatten().fieldErrors));
  }
  const created = store.createProject(parsed.data as any);
  logger.info({ projectId: created.id, title: created.title }, 'Admin created project');
  res.status(201).json({ success: true, data: created });
});

const updateProject = (req: any, res: any, next: any) => {
  const updated = store.updateProject(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Project ${req.params.id} not found`));
  }
  logger.info({ projectId: updated.id }, 'Admin updated project');
  res.json({ success: true, data: updated });
};
adminRouter.put('/admin/projects/:id', updateProject);
adminRouter.patch('/admin/projects/:id', updateProject);

adminRouter.delete('/admin/projects/:id', (req, res, next) => {
  const deleted = store.deleteProject(req.params.id);
  if (!deleted) {
    return next(new NotFoundError(`Project ${req.params.id} not found`));
  }
  logger.info({ projectId: req.params.id }, 'Admin deleted project');
  res.json({ success: true, message: 'Project removed successfully' });
});

// EVENTS CRUD
adminRouter.get('/admin/events', (_req, res) => {
  res.json({ success: true, data: store.getEvents(false) });
});

adminRouter.post('/admin/events', (req, res, next) => {
  const parsed = EventSchema.omit({ id: true }).safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid event payload', parsed.error.flatten().fieldErrors));
  }
  const created = store.createEvent(parsed.data as any);
  logger.info({ eventId: created.id, title: created.title }, 'Admin created event');
  res.status(201).json({ success: true, data: created });
});

const updateEvent = (req: any, res: any, next: any) => {
  const updated = store.updateEvent(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Event ${req.params.id} not found`));
  }
  logger.info({ eventId: updated.id }, 'Admin updated event');
  res.json({ success: true, data: updated });
};
adminRouter.put('/admin/events/:id', updateEvent);
adminRouter.patch('/admin/events/:id', updateEvent);

adminRouter.delete('/admin/events/:id', (req, res, next) => {
  const deleted = store.deleteEvent(req.params.id);
  if (!deleted) {
    return next(new NotFoundError(`Event ${req.params.id} not found`));
  }
  logger.info({ eventId: req.params.id }, 'Admin deleted event');
  res.json({ success: true, message: 'Event removed successfully' });
});

// ACHIEVEMENTS CRUD
adminRouter.get('/admin/achievements', (_req, res) => {
  res.json({ success: true, data: store.getAchievements(false) });
});

adminRouter.post('/admin/achievements', (req, res, next) => {
  const parsed = AchievementSchema.omit({ id: true }).safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid achievement payload', parsed.error.flatten().fieldErrors));
  }
  const created = store.createAchievement(parsed.data as any);
  logger.info({ achievementId: created.id, title: created.title }, 'Admin created achievement');
  res.status(201).json({ success: true, data: created });
});

const updateAchievement = (req: any, res: any, next: any) => {
  const updated = store.updateAchievement(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Achievement ${req.params.id} not found`));
  }
  logger.info({ achievementId: updated.id }, 'Admin updated achievement');
  res.json({ success: true, data: updated });
};
adminRouter.put('/admin/achievements/:id', updateAchievement);
adminRouter.patch('/admin/achievements/:id', updateAchievement);

adminRouter.delete('/admin/achievements/:id', (req, res, next) => {
  const deleted = store.deleteAchievement(req.params.id);
  if (!deleted) {
    return next(new NotFoundError(`Achievement ${req.params.id} not found`));
  }
  logger.info({ achievementId: req.params.id }, 'Admin deleted achievement');
  res.json({ success: true, message: 'Achievement removed successfully' });
});

// MEMBERS CRUD
adminRouter.get('/admin/members', (_req, res) => {
  res.json({ success: true, data: store.getMembers(false) });
});

adminRouter.post('/admin/members', (req, res, next) => {
  const parsed = MemberSchema.omit({ id: true }).safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid member payload', parsed.error.flatten().fieldErrors));
  }
  const created = store.createMember(parsed.data as any);
  logger.info({ memberId: created.id, name: created.name }, 'Admin added member');
  res.status(201).json({ success: true, data: created });
});

const updateMember = (req: any, res: any, next: any) => {
  const updated = store.updateMember(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Member ${req.params.id} not found`));
  }
  logger.info({ memberId: updated.id }, 'Admin updated member');
  res.json({ success: true, data: updated });
};
adminRouter.put('/admin/members/:id', updateMember);
adminRouter.patch('/admin/members/:id', updateMember);

adminRouter.delete('/admin/members/:id', (req, res, next) => {
  const deleted = store.deleteMember(req.params.id);
  if (!deleted) {
    return next(new NotFoundError(`Member ${req.params.id} not found`));
  }
  logger.info({ memberId: req.params.id }, 'Admin deleted member');
  res.json({ success: true, message: 'Member removed successfully' });
});

// ALUMNI CRUD
adminRouter.get('/admin/alumni', (_req, res) => {
  res.json({ success: true, data: store.getAlumni(false) });
});

adminRouter.post('/admin/alumni', (req, res, next) => {
  const parsed = AlumniSchema.omit({ id: true }).safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid alumni payload', parsed.error.flatten().fieldErrors));
  }
  const created = store.createAlumni(parsed.data as any);
  logger.info({ alumniId: created.id, name: created.name }, 'Admin added alumni');
  res.status(201).json({ success: true, data: created });
});

const updateAlumni = (req: any, res: any, next: any) => {
  const updated = store.updateAlumni(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Alumni ${req.params.id} not found`));
  }
  logger.info({ alumniId: updated.id }, 'Admin updated alumni');
  res.json({ success: true, data: updated });
};
adminRouter.put('/admin/alumni/:id', updateAlumni);
adminRouter.patch('/admin/alumni/:id', updateAlumni);

adminRouter.delete('/admin/alumni/:id', (req, res, next) => {
  const deleted = store.deleteAlumni(req.params.id);
  if (!deleted) {
    return next(new NotFoundError(`Alumni ${req.params.id} not found`));
  }
  logger.info({ alumniId: req.params.id }, 'Admin deleted alumni');
  res.json({ success: true, message: 'Alumni removed successfully' });
});

// TRACKS (Curriculum)
adminRouter.get('/admin/tracks', (_req, res) => {
  res.json({ success: true, data: store.getTracks(false) });
});

// SETTINGS (announcements, stats, headlines)
adminRouter.get('/admin/settings', (_req, res) => {
  res.json({ success: true, data: store.getSettings() });
});

const updateSettings = (req: any, res: any, next: any) => {
  const parsed = SiteSettingSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid settings payload', parsed.error.flatten().fieldErrors));
  }
  const updated = store.updateSettings(parsed.data as any);
  logger.info('Admin updated site settings');
  res.json({ success: true, data: updated });
};
adminRouter.put('/admin/settings', updateSettings);
adminRouter.patch('/admin/settings', updateSettings);

// APPLICATIONS REVIEW (Scalable for 1,000+ candidates)
adminRouter.get('/admin/applications', (req, res) => {
  const allApps = store.getApplications();

  // Compute live breakdown stats across the entire repository
  const stats = {
    total: allApps.length,
    pending: allApps.filter((a) => (a as any).status === 'PENDING').length,
    reviewing: allApps.filter((a) => (a as any).status === 'REVIEWING').length,
    shortlisted: allApps.filter((a) => (a as any).status === 'SHORTLISTED').length,
    accepted: allApps.filter((a) => (a as any).status === 'ACCEPTED').length,
    rejected: allApps.filter((a) => (a as any).status === 'REJECTED').length,
  };

  const { status, search, domain, page, limit } = req.query as Record<string, string | undefined>;

  let filtered = allApps;

  if (status && status !== 'ALL') {
    filtered = filtered.filter((a) => (a as any).status === status);
  }

  if (domain && domain !== 'ALL') {
    filtered = filtered.filter((a) => a.interest === domain);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((a) => {
      return (
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.studentId.toLowerCase().includes(q) ||
        a.branch.toLowerCase().includes(q) ||
        a.statementOfPurpose.toLowerCase().includes(q) ||
        (Array.isArray((a as any).skills) && (a as any).skills.some((s: string) => s.toLowerCase().includes(q)))
      );
    });
  }

  // Handle optional server-side pagination
  if (page || limit) {
    const pageNum = Math.max(1, parseInt(page || '1', 10));
    const pageSize = Math.min(200, Math.max(1, parseInt(limit || '50', 10)));
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIdx = (pageNum - 1) * pageSize;
    const paginatedItems = filtered.slice(startIdx, startIdx + pageSize);

    res.json({
      success: true,
      data: paginatedItems,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: totalCount,
        totalPages,
      },
      stats,
    });
    return;
  }

  // Backwards-compatible default: returns full list with stats attached
  res.json({
    success: true,
    data: filtered,
    stats,
  });
});

adminRouter.patch('/admin/applications/bulk-status', (req, res, next) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || typeof status !== 'string') {
    return next(new ValidationError('Field "ids" must be an array and "status" must be a string'));
  }
  const count = store.bulkUpdateApplicationStatus(ids, status);
  logger.info({ count, status }, 'Admin bulk updated applications');
  res.json({ success: true, count, message: `Successfully updated ${count} applications to ${status}` });
});

adminRouter.post('/admin/applications/bulk', (req, res, next) => {
  const { applications } = req.body;
  if (!Array.isArray(applications)) {
    return next(new ValidationError('Field "applications" must be an array'));
  }
  const created = store.bulkAddApplications(applications);
  logger.info({ count: created.length }, 'Admin bulk imported applications');
  res.status(201).json({ success: true, count: created.length, data: created });
});

// CSV Export with RFC-4180 and Formula Injection Defense
adminRouter.get('/admin/applications/export', (_req, res) => {
  const apps = store.getApplications();
  const sanitize = (val: any) => {
    if (val === null || val === undefined) return '""';
    let str = String(val).replace(/"/g, '""');
    // Defend against CSV injection (CWE-1236)
    if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
      str = `'${str}`;
    }
    return `"${str}"`;
  };

  const headers = [
    'ID',
    'Full Name',
    'Email',
    'Phone',
    'Student ID',
    'Year',
    'Branch',
    'Track Interest',
    'Skills',
    'Portfolio URL',
    'Status',
    'Review Notes',
    'Statement of Purpose',
    'Submitted At',
  ];

  const rows = apps.map((app) => [
    sanitize(app.id),
    sanitize(app.fullName),
    sanitize(app.email),
    sanitize(app.phone),
    sanitize(app.studentId),
    sanitize(app.yearOfStudy),
    sanitize(app.branch),
    sanitize(app.interest),
    sanitize((app.skills || []).join('; ')),
    sanitize(app.githubOrPortfolio || ''),
    sanitize(app.status || 'PENDING'),
    sanitize(app.reviewNotes || ''),
    sanitize(app.statementOfPurpose),
    sanitize(app.createdAt || ''),
  ]);

  const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="traic-applications-${new Date().toISOString().split('T')[0]}.csv"`);
  res.send(csv);
});

const updateApplication = (req: any, res: any, next: any) => {
  const updated = store.updateApplication(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Application ${req.params.id} not found`));
  }
  logger.info({ applicationId: updated.id, status: updated.status }, 'Admin updated application');
  res.json({ success: true, data: updated });
};
adminRouter.put('/admin/applications/:id', updateApplication);
adminRouter.patch('/admin/applications/:id', updateApplication);

adminRouter.delete('/admin/applications/:id', (req, res, next) => {
  const deleted = store.deleteApplication(req.params.id);
  if (!deleted) {
    return next(new NotFoundError(`Application ${req.params.id} not found`));
  }
  logger.info({ applicationId: req.params.id }, 'Admin deleted application');
  res.json({ success: true, message: 'Application deleted successfully' });
});

// BANNERS CRUD
adminRouter.get('/admin/banners', (_req, res) => {
  res.json({ success: true, data: store.getBanners(false) });
});

adminRouter.post('/admin/banners', (req, res, next) => {
  const parsed = BannerSchema.omit({ id: true, createdAt: true }).safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid banner payload', parsed.error.flatten().fieldErrors));
  }
  const created = store.createBanner(parsed.data as any);
  logger.info({ bannerId: created.id, title: created.title }, 'Admin created banner');
  res.status(201).json({ success: true, data: created });
});

const updateBanner = (req: any, res: any, next: any) => {
  const updated = store.updateBanner(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Banner ${req.params.id} not found`));
  }
  logger.info({ bannerId: updated.id }, 'Admin updated banner');
  res.json({ success: true, data: updated });
};
adminRouter.put('/admin/banners/:id', updateBanner);
adminRouter.patch('/admin/banners/:id', updateBanner);

adminRouter.delete('/admin/banners/:id', (req, res, next) => {
  const deleted = store.deleteBanner(req.params.id);
  if (!deleted) {
    return next(new NotFoundError(`Banner ${req.params.id} not found`));
  }
  logger.info({ bannerId: req.params.id }, 'Admin deleted banner');
  res.json({ success: true, message: 'Banner removed successfully' });
});

// GALLERY CRUD
adminRouter.get('/admin/gallery', (_req, res) => {
  res.json({ success: true, data: store.getGallery() });
});

adminRouter.post('/admin/gallery', (req, res, next) => {
  const parsed = GalleryItemSchema.omit({ id: true }).safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid gallery item payload', parsed.error.flatten().fieldErrors));
  }
  const created = store.createGalleryItem(parsed.data as any);
  logger.info({ galleryId: created.id, title: created.title }, 'Admin created gallery item');
  res.status(201).json({ success: true, data: created });
});

const updateGallery = (req: any, res: any, next: any) => {
  const updated = store.updateGalleryItem(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Gallery item ${req.params.id} not found`));
  }
  logger.info({ galleryId: updated.id }, 'Admin updated gallery item');
  res.json({ success: true, data: updated });
};
adminRouter.put('/admin/gallery/:id', updateGallery);
adminRouter.patch('/admin/gallery/:id', updateGallery);

adminRouter.delete('/admin/gallery/:id', (req, res, next) => {
  const deleted = store.deleteGalleryItem(req.params.id);
  if (!deleted) {
    return next(new NotFoundError(`Gallery item ${req.params.id} not found`));
  }
  logger.info({ galleryId: req.params.id }, 'Admin deleted gallery item');
  res.json({ success: true, message: 'Gallery item removed successfully' });
});

// LAB GEAR CRUD
adminRouter.get('/admin/gear', (_req, res) => {
  res.json({ success: true, data: store.getGear(false) });
});

adminRouter.post('/admin/gear', (req, res, next) => {
  const parsed = LabGearSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid lab gear payload', parsed.error.flatten().fieldErrors));
  }
  const created = store.createGear(parsed.data as any);
  logger.info({ gearId: created.id, name: created.name }, 'Admin created lab gear');
  res.status(201).json({ success: true, data: created });
});

const updateGear = (req: any, res: any, next: any) => {
  const parsed = LabGearSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid lab gear payload', parsed.error.flatten().fieldErrors));
  }
  const updated = store.updateGear(req.params.id, parsed.data as any);
  if (!updated) {
    return next(new NotFoundError(`Lab gear ${req.params.id} not found`));
  }
  logger.info({ gearId: updated.id }, 'Admin updated lab gear');
  res.json({ success: true, data: updated });
};
adminRouter.put('/admin/gear/:id', updateGear);
adminRouter.patch('/admin/gear/:id', updateGear);

adminRouter.patch('/admin/gear/:id/toggle', (req, res, next) => {
  const updated = store.toggleGear(req.params.id);
  if (!updated) {
    return next(new NotFoundError(`Lab gear ${req.params.id} not found`));
  }
  logger.info({ gearId: updated.id, isPublished: updated.isPublished }, 'Admin toggled lab gear visibility');
  res.json({ success: true, data: updated });
});

adminRouter.delete('/admin/gear/:id', (req, res, next) => {
  const deleted = store.deleteGear(req.params.id);
  if (!deleted) {
    return next(new NotFoundError(`Lab gear ${req.params.id} not found`));
  }
  logger.info({ gearId: req.params.id }, 'Admin deleted lab gear');
  res.json({ success: true, message: 'Lab gear deleted successfully' });
});
