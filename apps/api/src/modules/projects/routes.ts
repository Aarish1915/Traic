import { Router } from 'express';
import { ProjectRepo } from './repo';
import { NotFoundError } from '../../common/errors';
import { validateBody } from '../../common/middleware/validate';
import { ProjectSchema } from '@traic/shared';

export const projectRouter = Router();

// --- PUBLIC ROUTES (Read-Only) ---
projectRouter.get('/public/projects', async (_req, res, next) => {
  try {
    const projects = await ProjectRepo.findAll(true);
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
});

projectRouter.get('/public/projects/:slug', async (req, res, next) => {
  try {
    const project = await ProjectRepo.findBySlug(req.params.slug as string, true);
    if (!project) throw new NotFoundError(`Project '${req.params.slug}' not found`);
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// --- ADMIN ROUTES (Protected CRUD) ---
projectRouter.get('/admin/projects', async (_req, res, next) => {
  try {
    const projects = await ProjectRepo.findAll(false);
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
});

projectRouter.post('/admin/projects', validateBody(ProjectSchema), async (req, res, next) => {
  try {
    const data = req.body;
    const created = await ProjectRepo.create({
      slug: data.slug,
      title: data.title,
      tagline: data.tagline || '',
      description: data.descriptionMd || data.description || '',
      category: data.category,
      year: data.year || 2026,
      techStack: data.techStack || [],
      status: data.status,
      repoUrl: data.repoUrl || null,
      schematicUrl: data.schematicUrl || null,
      liveUrl: data.liveUrl || data.demoUrl || null,
      featured: data.featured || false,
      published: data.published ?? (data.status === 'PUBLISHED'),
    });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

projectRouter.put('/admin/projects/:id', validateBody(ProjectSchema), async (req, res, next) => {
  try {
    const data = req.body;
    const updated = await ProjectRepo.update(req.params.id as string, {
      slug: data.slug,
      title: data.title,
      tagline: data.tagline,
      description: data.descriptionMd || data.description,
      category: data.category,
      year: data.year,
      techStack: data.techStack,
      status: data.status,
      repoUrl: data.repoUrl,
      schematicUrl: data.schematicUrl,
      liveUrl: data.liveUrl || data.demoUrl,
      featured: data.featured,
      published: data.published ?? (data.status === 'PUBLISHED'),
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

projectRouter.delete('/admin/projects/:id', async (req, res, next) => {
  try {
    await ProjectRepo.delete(req.params.id as string);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
});
