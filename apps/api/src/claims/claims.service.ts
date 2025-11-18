import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClaimDto, UpdateClaimDto } from './dto';

@Injectable()
export class ClaimsService {
  constructor(private prisma: PrismaService) {}

  async findAll(facilityId: string) {
    return this.prisma.claim.findMany({
      where: { facilityId },
      orderBy: { yearMonth: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.claim.findUnique({
      where: { id },
      include: {
        facility: true,
      },
    });
  }

  async create(data: CreateClaimDto) {
    return this.prisma.claim.create({
      data,
    });
  }

  async update(id: string, data: UpdateClaimDto) {
    return this.prisma.claim.update({
      where: { id },
      data,
    });
  }

  async getSummary(facilityId: string, year?: number) {
    const where = {
      facilityId,
      ...(year
        ? {
            yearMonth: {
              startsWith: year.toString(),
            },
          }
        : {}),
    };

    const [claims, totalAmount] = await Promise.all([
      this.prisma.claim.findMany({
        where,
        orderBy: { yearMonth: 'asc' },
      }),
      this.prisma.claim.aggregate({
        where,
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      claims,
      totalAmount: totalAmount._sum.amount || 0,
    };
  }
}
