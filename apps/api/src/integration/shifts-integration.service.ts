import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ImportShiftsDto, ShiftImportData } from './dto';

@Injectable()
export class ShiftsIntegrationService {
  constructor(private prisma: PrismaService) {}

  async importShifts(dto: ImportShiftsDto) {
    const { facilityId, shifts, source } = dto;

    // データ検証
    if (!shifts || shifts.length === 0) {
      throw new BadRequestException('シフトデータが空です');
    }

    // トランザクション内で一括インポート
    const result = await this.prisma.$transaction(async (tx) => {
      const importedShifts = [];
      const errors = [];

      for (const shift of shifts) {
        try {
          // スタッフの存在確認
          const staff = await tx.staff.findUnique({
            where: { id: shift.staffId },
          });

          if (!staff) {
            errors.push({
              staffId: shift.staffId,
              error: '職員が見つかりません',
            });
            continue;
          }

          // 既存のシフトを確認（重複回避）
          const existing = await tx.shift.findUnique({
            where: {
              facilityId_staffId_date_shiftType: {
                facilityId,
                staffId: shift.staffId,
                date: new Date(shift.date),
                shiftType: shift.shiftType,
              },
            },
          });

          if (existing) {
            // 既存データを更新
            const updated = await tx.shift.update({
              where: { id: existing.id },
              data: {
                startTime: shift.startTime,
                endTime: shift.endTime,
                importedFrom: source || 'shift-scheduler-v3',
                importedAt: new Date(),
              },
            });
            importedShifts.push(updated);
          } else {
            // 新規作成
            const created = await tx.shift.create({
              data: {
                facilityId,
                staffId: shift.staffId,
                date: new Date(shift.date),
                shiftType: shift.shiftType,
                startTime: shift.startTime,
                endTime: shift.endTime,
                importedFrom: source || 'shift-scheduler-v3',
                importedAt: new Date(),
              },
            });
            importedShifts.push(created);
          }
        } catch (error) {
          errors.push({
            shift,
            error: error.message,
          });
        }
      }

      return {
        success: true,
        imported: importedShifts.length,
        total: shifts.length,
        errors: errors.length > 0 ? errors : undefined,
      };
    });

    return result;
  }

  async getImportHistory(facilityId: string, limit = 10) {
    const recentImports = await this.prisma.shift.findMany({
      where: {
        facilityId,
        importedAt: { not: null },
      },
      orderBy: {
        importedAt: 'desc',
      },
      take: limit,
      select: {
        importedFrom: true,
        importedAt: true,
      },
      distinct: ['importedAt'],
    });

    return recentImports;
  }
}
