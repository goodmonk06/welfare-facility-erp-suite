import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentDto, UpdateResidentDto } from './dto';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(facilityId: string) {
    return this.prisma.resident.findMany({
      where: { facilityId },
      orderBy: { lastName: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.resident.findUnique({
      where: { id },
      include: {
        facility: true,
        incidentReports: {
          orderBy: { occurredAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async create(data: CreateResidentDto) {
    return this.prisma.resident.create({
      data,
    });
  }

  async update(id: string, data: UpdateResidentDto) {
    return this.prisma.resident.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.resident.delete({
      where: { id },
    });
  }

  async getStats(facilityId: string) {
    const [total, active, careLevels] = await Promise.all([
      this.prisma.resident.count({ where: { facilityId } }),
      this.prisma.resident.count({
        where: { facilityId, status: 'active' },
      }),
      this.prisma.resident.groupBy({
        by: ['careLevel'],
        where: { facilityId, status: 'active' },
        _count: true,
      }),
    ]);

    return {
      total,
      active,
      careLevels: careLevels.reduce((acc, item) => {
        acc[`level${item.careLevel}`] = item._count;
        return acc;
      }, {}),
    };
  }
}
