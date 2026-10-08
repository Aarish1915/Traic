import { prisma } from '../db/prisma';
import type { Prisma } from '@prisma/client';

export class EventRepo {
  static async findAll(publishedOnly: boolean) {
    return prisma.event.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { date: 'desc' },
    });
  }

  static async findBySlug(slug: string, publishedOnly: boolean) {
    return prisma.event.findFirst({
      where: {
        slug,
        ...(publishedOnly ? { published: true } : {}),
      },
    });
  }

  static async create(data: Omit<Prisma.EventCreateInput, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.event.create({ data });
  }

  static async update(id: string, data: Partial<Prisma.EventUpdateInput>) {
    return prisma.event.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.event.delete({ where: { id } });
  }
}
