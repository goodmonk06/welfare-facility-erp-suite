import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ShiftImportData {
  @ApiProperty({ description: '職員ID' })
  @IsString()
  staffId: string;

  @ApiProperty({ description: 'シフト日付 (YYYY-MM-DD)' })
  @IsString()
  date: string;

  @ApiProperty({ description: 'シフト種別 (early, day, late, night等)' })
  @IsString()
  shiftType: string;

  @ApiProperty({ description: '開始時刻 (HH:mm)', required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ description: '終了時刻 (HH:mm)', required: false })
  @IsOptional()
  @IsString()
  endTime?: string;
}

export class ImportShiftsDto {
  @ApiProperty({ description: '事業所ID' })
  @IsString()
  facilityId: string;

  @ApiProperty({
    description: 'インポート元システム',
    required: false,
    default: 'shift-scheduler-v3',
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ description: 'シフトデータ配列', type: [ShiftImportData] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShiftImportData)
  shifts: ShiftImportData[];
}
