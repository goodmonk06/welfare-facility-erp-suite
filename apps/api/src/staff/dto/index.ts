import { IsString, IsOptional, IsDate, IsArray, IsEnum, IsEmail, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// Enums
export enum StaffPosition {
  FACILITY_MANAGER = 'facility_manager',           // 施設長
  CARE_MANAGER = 'care_manager',                   // 介護支援専門員（ケアマネージャー）
  ADMINISTRATOR = 'administrator',                 // 管理者
  NURSE = 'nurse',                                 // 看護師
  CARE_WORKER = 'care_worker',                     // 介護職員
  PHYSICAL_THERAPIST = 'physical_therapist',       // 理学療法士（PT）
  OCCUPATIONAL_THERAPIST = 'occupational_therapist', // 作業療法士（OT）
  NUTRITIONIST = 'nutritionist',                   // 管理栄養士
  SOCIAL_WORKER = 'social_worker',                 // 生活相談員
  DRIVER = 'driver',                               // 運転手
  KITCHEN_STAFF = 'kitchen_staff',                 // 調理員
  CLEANING_STAFF = 'cleaning_staff',               // 清掃員
  ADMINISTRATIVE_STAFF = 'administrative_staff',   // 事務職員
  OTHER = 'other',                                 // その他
}

export enum EmploymentType {
  FULL_TIME = 'full_time',           // 正社員
  PART_TIME = 'part_time',           // パートタイム
  CONTRACT = 'contract',             // 契約社員
  TEMPORARY = 'temporary',           // 派遣
  INTERN = 'intern',                 // 研修生
}

export enum StaffStatus {
  ACTIVE = 'active',                 // 在職
  ON_LEAVE = 'on_leave',             // 休職中
  RESIGNED = 'resigned',             // 退職
}

export enum StaffQualification {
  CERTIFIED_CARE_WORKER = 'certified_care_worker',               // 介護福祉士
  CERTIFIED_SOCIAL_WORKER = 'certified_social_worker',           // 社会福祉士
  CARE_MANAGER = 'care_manager',                                 // 介護支援専門員
  REGISTERED_NURSE = 'registered_nurse',                         // 看護師
  PRACTICAL_NURSE = 'practical_nurse',                           // 准看護師
  PHYSICAL_THERAPIST = 'physical_therapist',                     // 理学療法士
  OCCUPATIONAL_THERAPIST = 'occupational_therapist',             // 作業療法士
  SPEECH_THERAPIST = 'speech_therapist',                         // 言語聴覚士
  REGISTERED_DIETITIAN = 'registered_dietitian',                 // 管理栄養士
  CARE_HELPER_2 = 'care_helper_2',                               // 介護職員初任者研修（旧ヘルパー2級）
  CARE_HELPER_1 = 'care_helper_1',                               // 介護職員実務者研修（旧ヘルパー1級）
  FIRST_AID = 'first_aid',                                       // 普通救命講習
  DRIVERS_LICENSE = 'drivers_license',                           // 運転免許
}

export class CreateStaffDto {
  @ApiProperty({ description: '事業所ID' })
  @IsString()
  @IsNotEmpty()
  facilityId: string;

  @ApiProperty({ description: '職員番号', example: 'EMP-0001' })
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @ApiProperty({ description: '姓', example: '田中' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: '名', example: '太郎' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: false, description: '姓（カナ）', example: 'タナカ' })
  @IsOptional()
  @IsString()
  lastNameKana?: string;

  @ApiProperty({ required: false, description: '名（カナ）', example: 'タロウ' })
  @IsOptional()
  @IsString()
  firstNameKana?: string;

  @ApiProperty({ required: false, description: 'メールアドレス', example: 'tanaka@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, description: '電話番号', example: '090-1234-5678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: StaffPosition, description: '役職', example: StaffPosition.CARE_WORKER })
  @IsEnum(StaffPosition)
  position: StaffPosition;

  @ApiProperty({ enum: EmploymentType, description: '雇用形態', example: EmploymentType.FULL_TIME })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiProperty({ description: '入社日', example: '2024-01-01' })
  @Type(() => Date)
  @IsDate()
  hireDate: Date;

  @ApiProperty({
    required: false,
    description: '退職日',
    example: '2024-12-31'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  resignationDate?: Date;

  @ApiProperty({
    enum: StaffStatus,
    required: false,
    description: 'ステータス',
    default: StaffStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;

  @ApiProperty({
    required: false,
    description: '保有資格',
    example: [StaffQualification.CERTIFIED_CARE_WORKER, StaffQualification.FIRST_AID],
    type: [String],
    enum: StaffQualification,
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  qualifications?: string[];
}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}
