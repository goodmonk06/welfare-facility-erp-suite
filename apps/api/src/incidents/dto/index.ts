import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateIncidentDto {
  @ApiProperty()
  @IsString()
  facilityId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  residentId?: string;

  @ApiProperty()
  @IsString()
  reporterId: string;

  @ApiProperty()
  @IsString()
  incidentType: string;

  @ApiProperty()
  @IsString()
  severity: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  occurredAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  actionTaken?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preventiveMeasure?: string;
}

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
