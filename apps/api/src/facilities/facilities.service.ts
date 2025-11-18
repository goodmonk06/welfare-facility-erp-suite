import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacilityDto, UpdateFacilityDto } from './dto';

@Injectable()
export class FacilitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.facility.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const facility = await this.prisma.facility.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            residents: true,
            staff: true,
            shifts: true,
            claims: true,
            incidentReports: true,
            tasks: true,
          },
        },
      },
    });

    if (!facility) {
      throw new NotFoundException(`Facility with ID ${id} not found`);
    }

    return facility;
  }

  async create(data: CreateFacilityDto) {
    return this.prisma.facility.create({
      data,
    });
  }

  async update(id: string, data: UpdateFacilityDto) {
    await this.findOne(id); // Check existence
    return this.prisma.facility.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    return this.prisma.facility.delete({
      where: { id },
    });
  }
}
