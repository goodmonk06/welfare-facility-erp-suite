import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto } from './dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async findAll(facilityId: string) {
    return this.prisma.staff.findMany({
      where: { facilityId },
      orderBy: { employeeNumber: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.staff.findUnique({
      where: { id },
      include: {
        facility: true,
        shifts: {
          where: {
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    });
  }

  async create(data: CreateStaffDto) {
    return this.prisma.staff.create({
      data,
    });
  }

  async update(id: string, data: UpdateStaffDto) {
    return this.prisma.staff.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.staff.delete({
      where: { id },
    });
  }

  async getOnDutyStaff(facilityId: string, date: Date) {
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
      },
    });
  }
}
