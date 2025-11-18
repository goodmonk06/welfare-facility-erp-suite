import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto } from './dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async findAll(facilityId: string) {
    if (!facilityId) {
      throw new BadRequestException('Facility ID is required');
    }

    return this.prisma.staff.findMany({
      where: { facilityId },
      orderBy: [
        { status: 'asc' },
        { employeeNumber: 'asc' },
      ],
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        certifications: {
          where: {
            status: 'active',
          },
          select: {
            id: true,
            name: true,
            expiryDate: true,
            status: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
        },
        certifications: {
          orderBy: { expiryDate: 'desc' },
        },
        shifts: {
          where: {
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
          orderBy: { date: 'desc' },
          take: 50,
        },
        leaveRequests: {
          where: {
            status: {
              in: ['pending', 'approved'],
            },
          },
          orderBy: { startDate: 'desc' },
          take: 10,
        },
        schedulePreferences: {
          where: {
            effectiveUntil: {
              gte: new Date(),
            },
          },
        },
        performanceReviews: {
          orderBy: { reviewPeriodEnd: 'desc' },
          take: 5,
        },
        teamMemberships: {
          where: {
            leftAt: null,
          },
          include: {
            team: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }

    return staff;
  }

  async create(data: CreateStaffDto) {
    // Validate facility exists
    const facility = await this.prisma.facility.findUnique({
      where: { id: data.facilityId },
    });

    if (!facility) {
      throw new BadRequestException(`Facility with ID ${data.facilityId} not found`);
    }

    // Check for duplicate employee number
    const existingStaff = await this.prisma.staff.findUnique({
      where: { employeeNumber: data.employeeNumber },
    });

    if (existingStaff) {
      throw new BadRequestException(`Employee number ${data.employeeNumber} already exists`);
    }

    return this.prisma.staff.create({
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

  async update(id: string, data: UpdateStaffDto) {
    // Check staff exists
    const existingStaff = await this.prisma.staff.findUnique({
      where: { id },
    });

    if (!existingStaff) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }

    // If updating employee number, check for duplicates
    if (data.employeeNumber && data.employeeNumber !== existingStaff.employeeNumber) {
      const duplicateStaff = await this.prisma.staff.findUnique({
        where: { employeeNumber: data.employeeNumber },
      });

      if (duplicateStaff) {
        throw new BadRequestException(`Employee number ${data.employeeNumber} already exists`);
      }
    }

    // If updating facility, validate it exists
    if (data.facilityId && data.facilityId !== existingStaff.facilityId) {
      const facility = await this.prisma.facility.findUnique({
        where: { id: data.facilityId },
      });

      if (!facility) {
        throw new BadRequestException(`Facility with ID ${data.facilityId} not found`);
      }
    }

    return this.prisma.staff.update({
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
        certifications: {
          where: {
            status: 'active',
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check staff exists
    const staff = await this.prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }

    // Check if staff has any related data that should prevent deletion
    const hasShifts = await this.prisma.shift.count({
      where: { staffId: id },
    });

    if (hasShifts > 0) {
      throw new BadRequestException(
        `Cannot delete staff member with existing shift records. Consider marking as resigned instead.`
      );
    }

    return this.prisma.staff.delete({
      where: { id },
    });
  }

  async getOnDutyStaff(facilityId: string, date: Date) {
    if (!facilityId) {
      throw new BadRequestException('Facility ID is required');
    }

    if (!date || isNaN(date.getTime())) {
      throw new BadRequestException('Valid date is required');
    }

    return this.prisma.staff.findMany({
      where: {
        facilityId,
        status: 'active',
        shifts: {
          some: {
            date,
          },
        },
      },
      include: {
        shifts: {
          where: { date },
        },
        certifications: {
          where: {
            status: 'active',
          },
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        employeeNumber: 'asc',
      },
    });
  }

  // Additional helper methods

  async getStaffStatistics(facilityId: string) {
    const [total, active, onLeave, resigned, byPosition, byEmploymentType] = await Promise.all([
      this.prisma.staff.count({ where: { facilityId } }),
      this.prisma.staff.count({ where: { facilityId, status: 'active' } }),
      this.prisma.staff.count({ where: { facilityId, status: 'on_leave' } }),
      this.prisma.staff.count({ where: { facilityId, status: 'resigned' } }),
      this.prisma.staff.groupBy({
        by: ['position'],
        where: { facilityId, status: 'active' },
        _count: true,
      }),
      this.prisma.staff.groupBy({
        by: ['employmentType'],
        where: { facilityId, status: 'active' },
        _count: true,
      }),
    ]);

    return {
      total,
      active,
      onLeave,
      resigned,
      byPosition: byPosition.reduce((acc, item) => {
        acc[item.position] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byEmploymentType: byEmploymentType.reduce((acc, item) => {
        acc[item.employmentType] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
