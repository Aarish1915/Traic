import { Router } from 'express';
import { EventRepo } from './repo';
import { NotFoundError } from '../../common/errors';
import { validateBody } from '../../common/middleware/validate';
import { EventSchema } from '@traic/shared';

export const eventRouter = Router();

// --- PUBLIC ROUTES (Read-Only) ---
eventRouter.get('/public/events', async (_req, res, next) => {
  try {
    const events = await EventRepo.findAll(true);
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
});

eventRouter.get('/public/events/:slug', async (req, res, next) => {
  try {
    const event = await EventRepo.findBySlug(req.params.slug as string, true);
    if (!event) throw new NotFoundError(`Event '${req.params.slug}' not found`);
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
});

// --- ADMIN ROUTES (Protected CRUD) ---
eventRouter.get('/admin/events', async (_req, res, next) => {
  try {
    const events = await EventRepo.findAll(false);
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
});

eventRouter.post('/admin/events', validateBody(EventSchema), async (req, res, next) => {
  try {
    const data = req.body;
    const created = await EventRepo.create({
      slug: data.slug,
      title: data.title,
      tagline: data.tagline || '',
      descriptionMd: data.descriptionMd || data.description || '',
      type: data.type || 'Workshop',
      mode: data.mode || 'OFFLINE',
      venue: data.venue || 'TRAIC Lab',
      startsAt: new Date(data.startsAt || data.date || Date.now()),
      endsAt: data.endsAt ? new Date(data.endsAt) : null,
      registerUrl: data.registerUrl || null,
      bannerAssetUrl: data.bannerAssetUrl || null,
      photos: data.photos || [],
      prizePool: data.prizePool || null,
      teamSize: data.teamSize || null,
      capacity: data.capacity || null,
      tracks: data.tracks || [],
      schedule: data.schedule || null,
      customDetails: data.customDetails || null,
      isFlagship: data.isFlagship || false,
      published: data.published ?? (data.status === 'PUBLISHED'),
    });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

eventRouter.put('/admin/events/:id', validateBody(EventSchema), async (req, res, next) => {
  try {
    const data = req.body;
    const updated = await EventRepo.update(req.params.id as string, {
      slug: data.slug,
      title: data.title,
      tagline: data.tagline,
      descriptionMd: data.descriptionMd || data.description,
      type: data.type,
      mode: data.mode,
      venue: data.venue,
      startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
      endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      registerUrl: data.registerUrl,
      bannerAssetUrl: data.bannerAssetUrl,
      photos: data.photos,
      prizePool: data.prizePool,
      teamSize: data.teamSize,
      capacity: data.capacity,
      tracks: data.tracks,
      schedule: data.schedule,
      customDetails: data.customDetails,
      isFlagship: data.isFlagship,
      published: data.published ?? (data.status === 'PUBLISHED'),
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

eventRouter.delete('/admin/events/:id', async (req, res, next) => {
  try {
    await EventRepo.delete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
});
