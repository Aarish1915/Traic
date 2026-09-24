import { Router } from 'express';
import {
  JoinApplicationSchema,
  ContactMessageSchema,
} from '@traic/shared';
import { store } from './data';
import { validateBody } from '../../common/middleware/validate';
import { NotFoundError } from '../../common/errors';
import { logger } from '../../common/logger';
import { publicFormRateLimiter } from '../admin/auth';

export const publicRouter = Router();

// Projects (Published only)
publicRouter.get('/public/projects', (_req, res) => {
  res.json({ success: true, data: store.getProjects(true) });
});

publicRouter.get('/public/projects/:slug', (req, res, next) => {
  const project = store.getProjectBySlug(req.params.slug, true);
  if (!project) {
    return next(new NotFoundError(`Project with slug '${req.params.slug}' not found`));
  }
  res.json({ success: true, data: project });
});

// Achievements (Published only)
publicRouter.get('/public/achievements', (_req, res) => {
  res.json({ success: true, data: store.getAchievements(true) });
});

// Events (Published only)
publicRouter.get('/public/events', (_req, res) => {
  res.json({ success: true, data: store.getEvents(true) });
});

publicRouter.get('/public/events/:slug', (req, res, next) => {
  const event = store.getEventBySlug(req.params.slug, true);
  if (!event) {
    return next(new NotFoundError(`Event with slug '${req.params.slug}' not found`));
  }
  res.json({ success: true, data: event });
});

// Team (Active members only)
publicRouter.get('/public/team', (_req, res) => {
  res.json({ success: true, data: store.getMembers(true) });
});

// Alumni (Active alumni only)
publicRouter.get('/public/alumni', (_req, res) => {
  res.json({ success: true, data: store.getAlumni(true) });
});

// Tracks (Curriculum)
publicRouter.get('/public/tracks', (_req, res) => {
  res.json({ success: true, data: store.getTracks(true) });
});

// Site Settings
publicRouter.get('/public/settings', (_req, res) => {
  res.json({ success: true, data: store.getSettings() });
});

// Banners (Active only for public site)
publicRouter.get('/public/banners', (_req, res) => {
  res.json({ success: true, data: store.getBanners(true) });
});

// Gallery & Field Dispatches (Active only)
publicRouter.get('/public/gallery', (_req, res) => {
  res.json({ success: true, data: store.getGallery(true) });
});

// Join Form Submission
publicRouter.post(
  '/public/applications',
  publicFormRateLimiter,
  validateBody(JoinApplicationSchema),
  (req, res) => {
    const saved = store.addApplication(req.body);
    logger.info({ applicant: saved.email, track: saved.interest }, 'New application received');
    res.status(201).json({
      success: true,
      message: 'Application received successfully. The TRAIC leads team will review your application.',
      data: saved,
    });
  }
);

// Contact Form Submission
publicRouter.post(
  '/public/contact',
  publicFormRateLimiter,
  validateBody(ContactMessageSchema),
  (req, res) => {
    const saved = store.addMessage(req.body);
    logger.info({ contactEmail: saved.email, subject: saved.subject }, 'New contact message received');
    res.status(201).json({
      success: true,
      message: 'Your message has been sent. We will get back to you shortly.',
      data: saved,
    });
  }
);
