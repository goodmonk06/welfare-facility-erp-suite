import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentDto, UpdateResidentDto } from './dto';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(facilityId: string) {
    if (!facilityId) {
      throw new BadRequestException('facilityId is required');
    }

    return this.prisma.resident.findMany({
      where: { facilityId },
      orderBy: { lastName: 'asc' },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id },
      include: {
        facility: true,
        incidentReports: {
          orderBy: { occurredAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!resident) {
      throw new NotFoundException(`Resident with ID ${id} not found`);
    }

    return resident;
  }

  async create(data: CreateResidentDto) {
    // Verify facility exists
    const facility = await this.prisma.facility.findUnique({
      where: { id: data.facilityId },
    });

    if (!facility) {
      throw new BadRequestException(`Facility with ID ${data.facilityId} not found`);
    }

    return this.prisma.resident.create({
      data,
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateResidentDto) {
    await this.findOne(id); // Check existence

    return this.prisma.resident.update({
      where: { id },
      data,
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence

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
