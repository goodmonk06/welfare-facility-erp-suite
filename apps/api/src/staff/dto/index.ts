import { IsString, IsOptional, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty()
  @IsString()
  facilityId: string;

  @ApiProperty()
  @IsString()
  employeeNumber: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsString()
  employmentType: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  hireDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  qualifications?: string[];
}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}
