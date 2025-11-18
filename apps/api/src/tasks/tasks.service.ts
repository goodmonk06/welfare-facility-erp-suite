import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(facilityId: string, status?: string) {
    return this.prisma.task.findMany({
      where: {
        facilityId,
        ...(status ? { status } : {}),
      },
      include: {
        assignee: true,
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        facility: true,
        assignee: true,
      },
    });
  }

  async create(data: CreateTaskDto) {
    return this.prisma.task.create({
      data,
      include: {
        assignee: true,
      },
    });
  }

  async update(id: string, data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async getKanban(facilityId: string) {
    const [todo, inProgress, done] = await Promise.all([
      this.prisma.task.findMany({
        where: { facilityId, status: 'todo' },
        include: { assignee: true },
        orderBy: { priority: 'desc' },
      }),
      this.prisma.task.findMany({
        where: { facilityId, status: 'in_progress' },
        include: { assignee: true },
        orderBy: { priority: 'desc' },
      }),
      this.prisma.task.findMany({
        where: { facilityId, status: 'done' },
        include: { assignee: true },
        orderBy: { completedAt: 'desc' },
        take: 20,
      }),
    ]);

    return { todo, inProgress, done };
  }
}
