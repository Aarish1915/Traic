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

adminRouter.put('/admin/projects/:id', (req, res, next) => {
  const updated = store.updateProject(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Project ${req.params.id} not found`));
  }
  logger.info({ projectId: updated.id }, 'Admin updated project');
  res.json({ success: true, data: updated });
});

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

adminRouter.put('/admin/events/:id', (req, res, next) => {
  const updated = store.updateEvent(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Event ${req.params.id} not found`));
  }
  logger.info({ eventId: updated.id }, 'Admin updated event');
  res.json({ success: true, data: updated });
});

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

adminRouter.put('/admin/achievements/:id', (req, res, next) => {
  const updated = store.updateAchievement(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Achievement ${req.params.id} not found`));
  }
  logger.info({ achievementId: updated.id }, 'Admin updated achievement');
  res.json({ success: true, data: updated });
});

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

adminRouter.put('/admin/members/:id', (req, res, next) => {
  const updated = store.updateMember(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Member ${req.params.id} not found`));
  }
  logger.info({ memberId: updated.id }, 'Admin updated member');
  res.json({ success: true, data: updated });
});

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

adminRouter.put('/admin/alumni/:id', (req, res, next) => {
  const updated = store.updateAlumni(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Alumni ${req.params.id} not found`));
  }
  logger.info({ alumniId: updated.id }, 'Admin updated alumni');
  res.json({ success: true, data: updated });
});

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

adminRouter.put('/admin/settings', (req, res, next) => {
  const parsed = SiteSettingSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return next(new ValidationError('Invalid settings payload', parsed.error.flatten().fieldErrors));
  }
  const updated = store.updateSettings(parsed.data as any);
  logger.info('Admin updated site settings');
  res.json({ success: true, data: updated });
});

// APPLICATIONS REVIEW
adminRouter.get('/admin/applications', (_req, res) => {
  res.json({ success: true, data: store.getApplications() });
});

adminRouter.put('/admin/applications/:id', (req, res, next) => {
  const updated = store.updateApplication(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Application ${req.params.id} not found`));
  }
  logger.info({ applicationId: updated.id, status: updated.status }, 'Admin updated application');
  res.json({ success: true, data: updated });
});

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

adminRouter.put('/admin/banners/:id', (req, res, next) => {
  const updated = store.updateBanner(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Banner ${req.params.id} not found`));
  }
  logger.info({ bannerId: updated.id }, 'Admin updated banner');
  res.json({ success: true, data: updated });
});

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

adminRouter.put('/admin/gallery/:id', (req, res, next) => {
  const updated = store.updateGalleryItem(req.params.id, req.body);
  if (!updated) {
    return next(new NotFoundError(`Gallery item ${req.params.id} not found`));
  }
  logger.info({ galleryId: updated.id }, 'Admin updated gallery item');
  res.json({ success: true, data: updated });
});

adminRouter.delete('/admin/gallery/:id', (req, res, next) => {
  const deleted = store.deleteGalleryItem(req.params.id);
  if (!deleted) {
    return next(new NotFoundError(`Gallery item ${req.params.id} not found`));
  }
  logger.info({ galleryId: req.params.id }, 'Admin deleted gallery item');
  res.json({ success: true, message: 'Gallery item removed successfully' });
});
