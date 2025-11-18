import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto, UpdateIncidentDto } from './dto';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(facilityId: string) {
    return this.prisma.incidentReport.findMany({
      where: { facilityId },
      include: {
        resident: true,
        reporter: true,
      },
      orderBy: { occurredAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.incidentReport.findUnique({
      where: { id },
      include: {
        facility: true,
        resident: true,
        reporter: true,
      },
    });
  }

  async create(data: CreateIncidentDto) {
    return this.prisma.incidentReport.create({
      data,
      include: {
        resident: true,
        reporter: true,
      },
    });
  }

  async update(id: string, data: UpdateIncidentDto) {
    return this.prisma.incidentReport.update({
      where: { id },
      data,
      include: {
        resident: true,
        reporter: true,
      },
    });
  }

  async getStats(facilityId: string, startDate?: Date, endDate?: Date) {
    const where = {
      facilityId,
      ...(startDate && endDate
        ? {
            occurredAt: {
              gte: startDate,
              lte: endDate,
            },
          }
        : {}),
    };

    const [total, byType, bySeverity] = await Promise.all([
      this.prisma.incidentReport.count({ where }),
      this.prisma.incidentReport.groupBy({
        by: ['incidentType'],
        where,
        _count: true,
      }),
      this.prisma.incidentReport.groupBy({
        by: ['severity'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      byType,
      bySeverity,
    };
  }
}
