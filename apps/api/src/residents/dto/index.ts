import { IsString, IsOptional, IsDate, IsInt, IsBoolean, IsEnum, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum ResidentStatus {
  ACTIVE = 'active',
  DISCHARGED = 'discharged',
  DECEASED = 'deceased',
}

export class CreateResidentDto {
  @ApiProperty({ description: '事業所ID' })
  @IsString()
  @IsNotEmpty()
  facilityId: string;

  @ApiProperty({ description: '姓' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: '名' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: false, description: '姓（カナ）' })
  @IsOptional()
  @IsString()
  lastNameKana?: string;

  @ApiProperty({ required: false, description: '名（カナ）' })
  @IsOptional()
  @IsString()
  firstNameKana?: string;

  @ApiProperty({ description: '生年月日', type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({ enum: Gender, description: '性別' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ required: false, description: '要介護度 (0-5)', minimum: 0, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  careLevel?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  admissionDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasMedicalNeeds?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasAllergies?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emergencyPhone?: string;
}

export class UpdateResidentDto extends PartialType(CreateResidentDto) {}
