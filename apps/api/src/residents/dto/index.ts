import { IsString, IsOptional, IsDate, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateResidentDto {
  @ApiProperty()
  @IsString()
  facilityId: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastNameKana?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstNameKana?: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
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
