import { IsString, IsOptional, IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// Enums
export enum IncidentType {
  FALL = 'fall',                           // 転倒
  MEDICATION_ERROR = 'medication_error',   // 誤薬
  CHOKING = 'choking',                     // 誤嚥
  WANDERING = 'wandering',                 // 離設・徘徊
  VERBAL_ABUSE = 'verbal_abuse',           // 暴言
  PHYSICAL_ABUSE = 'physical_abuse',       // 暴力
  SKIN_INJURY = 'skin_injury',             // 皮膚損傷
  BURN = 'burn',                           // 熱傷
  FRACTURE = 'fracture',                   // 骨折
  PRESSURE_ULCER = 'pressure_ulcer',       // 褥瘡
  DEHYDRATION = 'dehydration',             // 脱水
  EQUIPMENT_MALFUNCTION = 'equipment_malfunction', // 機器故障
  ENVIRONMENTAL_HAZARD = 'environmental_hazard',   // 環境的危険
  NEAR_MISS = 'near_miss',                 // ヒヤリハット
  OTHER = 'other',                         // その他
}

export enum IncidentSeverity {
  LOW = 'low',                   // 低：軽微な影響
  MEDIUM = 'medium',             // 中：一時的な影響
  HIGH = 'high',                 // 高：重大な影響
  CRITICAL = 'critical',         // 緊急：生命に関わる
}

export enum IncidentStatus {
  REPORTED = 'reported',         // 報告済み
  UNDER_REVIEW = 'under_review', // 調査中
  ACTION_REQUIRED = 'action_required', // 対応必要
  RESOLVED = 'resolved',         // 解決済み
  CLOSED = 'closed',             // 完了
}

export class CreateIncidentDto {
  @ApiProperty({ description: '事業所ID' })
  @IsString()
  @IsNotEmpty()
  facilityId: string;

  @ApiProperty({ required: false, description: '対象利用者ID' })
  @IsOptional()
  @IsString()
  residentId?: string;

  @ApiProperty({ description: '報告者ID（職員）' })
  @IsString()
  @IsNotEmpty()
  reporterId: string;

  @ApiProperty({ required: false, description: 'カテゴリID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    enum: IncidentType,
    description: 'インシデント種別',
    example: IncidentType.FALL
  })
  @IsEnum(IncidentType)
  incidentType: IncidentType;

  @ApiProperty({
    enum: IncidentSeverity,
    description: '重要度',
    example: IncidentSeverity.MEDIUM
  })
  @IsEnum(IncidentSeverity)
  severity: IncidentSeverity;

  @ApiProperty({ description: '発生日時', example: '2024-01-20T14:30:00Z' })
  @Type(() => Date)
  @IsDate()
  occurredAt: Date;

  @ApiProperty({ required: false, description: '発生場所', example: '居室A101' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: '状況説明' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: false, description: '対応内容' })
  @IsOptional()
  @IsString()
  actionTaken?: string;

  @ApiProperty({ required: false, description: '再発防止策' })
  @IsOptional()
  @IsString()
  preventiveMeasure?: string;

  @ApiProperty({
    enum: IncidentStatus,
    required: false,
    description: 'ステータス',
    default: IncidentStatus.REPORTED
  })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;
}

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {}
