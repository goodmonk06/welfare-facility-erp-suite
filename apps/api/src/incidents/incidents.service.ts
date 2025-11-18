import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto, UpdateIncidentDto } from './dto';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(facilityId: string) {
    if (!facilityId) {
      throw new BadRequestException('Facility ID is required');
    }

    return this.prisma.incidentReport.findMany({
      where: { facilityId },
      include: {
        resident: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
          },
        },
        reporter: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            position: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        followUpActions: {
          select: {
            id: true,
            actionType: true,
            status: true,
            dueDate: true,
          },
          orderBy: {
            dueDate: 'asc',
          },
        },
      },
      orderBy: { occurredAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const incident = await this.prisma.incidentReport.findUnique({
      where: { id },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        resident: true,
        reporter: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            position: true,
            phone: true,
            email: true,
          },
        },
        category: true,
        followUpActions: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    return incident;
  }

  async create(data: CreateIncidentDto) {
    // Validate facility exists
    const facility = await this.prisma.facility.findUnique({
      where: { id: data.facilityId },
    });

    if (!facility) {
      throw new BadRequestException(`Facility with ID ${data.facilityId} not found`);
    }

    // Validate reporter (staff) exists
    const reporter = await this.prisma.staff.findUnique({
      where: { id: data.reporterId },
    });

    if (!reporter) {
      throw new BadRequestException(`Reporter (staff) with ID ${data.reporterId} not found`);
    }

    // Validate resident exists if provided
    if (data.residentId) {
      const resident = await this.prisma.resident.findUnique({
        where: { id: data.residentId },
      });

      if (!resident) {
        throw new BadRequestException(`Resident with ID ${data.residentId} not found`);
      }
    }

    // Validate category exists if provided
    if (data.categoryId) {
      const category = await this.prisma.incidentCategory.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new BadRequestException(`Incident category with ID ${data.categoryId} not found`);
      }
    }

    return this.prisma.incidentReport.create({
      data,
      include: {
        resident: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
          },
        },
        reporter: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            position: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateIncidentDto) {
    // Check incident exists
    const existingIncident = await this.prisma.incidentReport.findUnique({
      where: { id },
    });

    if (!existingIncident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    // Validate reporter if being updated
    if (data.reporterId && data.reporterId !== existingIncident.reporterId) {
      const reporter = await this.prisma.staff.findUnique({
        where: { id: data.reporterId },
      });

      if (!reporter) {
        throw new BadRequestException(`Reporter (staff) with ID ${data.reporterId} not found`);
      }
    }

    // Validate resident if being updated
    if (data.residentId && data.residentId !== existingIncident.residentId) {
      const resident = await this.prisma.resident.findUnique({
        where: { id: data.residentId },
      });

      if (!resident) {
        throw new BadRequestException(`Resident with ID ${data.residentId} not found`);
      }
    }

    // Validate category if being updated
    if (data.categoryId && data.categoryId !== existingIncident.categoryId) {
      const category = await this.prisma.incidentCategory.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new BadRequestException(`Incident category with ID ${data.categoryId} not found`);
      }
    }

    return this.prisma.incidentReport.update({
      where: { id },
      data,
      include: {
        resident: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
          },
        },
        reporter: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            position: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        followUpActions: true,
      },
    });
  }

  async remove(id: string) {
    // Check incident exists
    const incident = await this.prisma.incidentReport.findUnique({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    return this.prisma.incidentReport.delete({
      where: { id },
    });
  }

  async getStats(facilityId: string, startDate?: Date, endDate?: Date) {
    if (!facilityId) {
      throw new BadRequestException('Facility ID is required');
    }

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

    const [total, byType, bySeverity, byStatus, critical] = await Promise.all([
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
      this.prisma.incidentReport.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      this.prisma.incidentReport.count({
        where: {
          ...where,
          severity: 'critical',
        },
      }),
    ]);

    return {
      total,
      critical,
      byType: byType.reduce((acc, item) => {
        acc[item.incidentType] = item._count;
        return acc;
      }, {} as Record<string, number>),
      bySeverity: bySeverity.reduce((acc, item) => {
        acc[item.severity] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  // Get recent critical incidents
  async getCriticalIncidents(facilityId: string, days: number = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.prisma.incidentReport.findMany({
      where: {
        facilityId,
        severity: 'critical',
        occurredAt: {
          gte: since,
        },
      },
      include: {
        resident: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
          },
        },
        reporter: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
          },
        },
      },
      orderBy: {
        occurredAt: 'desc',
      },
      take: 10,
    });
  }
}
