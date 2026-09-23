import { Router } from 'express';
import {
  JoinApplicationSchema,
  ContactMessageSchema,
} from '@traic/shared';
import {
  seedProjects,
  seedAchievements,
  seedEvents,
  seedMembers,
  seedTracks,
  seedSettings,
} from './data';
import { validateBody } from '../../common/middleware/validate';
import { NotFoundError } from '../../common/errors';
import { logger } from '../../common/logger';

export const publicRouter = Router();

// Projects
publicRouter.get('/public/projects', (_req, res) => {
  res.json({ success: true, data: seedProjects });
});

publicRouter.get('/public/projects/:slug', (req, res, next) => {
  const project = seedProjects.find((p: any) => p.slug === req.params.slug);
  if (!project) {
    return next(new NotFoundError(`Project with slug '${req.params.slug}' not found`));
  }
  res.json({ success: true, data: project });
});

// Achievements
publicRouter.get('/public/achievements', (_req, res) => {
  res.json({ success: true, data: seedAchievements });
});

// Events
publicRouter.get('/public/events', (_req, res) => {
  res.json({ success: true, data: seedEvents });
});

publicRouter.get('/public/events/:slug', (req, res, next) => {
  const event = seedEvents.find((e: any) => e.slug === req.params.slug);
  if (!event) {
    return next(new NotFoundError(`Event with slug '${req.params.slug}' not found`));
  }
  res.json({ success: true, data: event });
});

// Team
publicRouter.get('/public/team', (_req, res) => {
  res.json({ success: true, data: seedMembers });
});

// Tracks
publicRouter.get('/public/tracks', (_req, res) => {
  res.json({ success: true, data: seedTracks });
});

// Site Settings
publicRouter.get('/public/settings', (_req, res) => {
  res.json({ success: true, data: seedSettings });
});

// Join Form Submission
publicRouter.post(
  '/public/applications',
  validateBody(JoinApplicationSchema),
  (req, res) => {
    logger.info({ applicant: req.body.email, track: req.body.interest }, 'New application received');
    res.status(201).json({
      success: true,
      message: 'Application received successfully. The TRAIC leads team will review your application.',
    });
  }
);

// Contact Form Submission
publicRouter.post(
  '/public/contact',
  validateBody(ContactMessageSchema),
  (req, res) => {
    logger.info({ contactEmail: req.body.email, subject: req.body.subject }, 'New contact message received');
    res.status(201).json({
      success: true,
      message: 'Your message has been sent. We will get back to you shortly.',
    });
  }
);
