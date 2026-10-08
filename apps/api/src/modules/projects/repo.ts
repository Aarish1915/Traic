import { prisma } from '../db/prisma';
import type { Prisma } from '@prisma/client';

export class ProjectRepo {
  static async findAll(publishedOnly: boolean) {
    return prisma.project.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findBySlug(slug: string, publishedOnly: boolean) {
    return prisma.project.findFirst({
      where: {
        slug,
        ...(publishedOnly ? { published: true } : {}),
      },
    });
  }

  static async create(data: Omit<Prisma.ProjectCreateInput, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.project.create({ data });
  }

  static async update(id: string, data: Partial<Prisma.ProjectUpdateInput>) {
    return prisma.project.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }
}
