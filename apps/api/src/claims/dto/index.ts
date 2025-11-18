import { IsString, IsInt, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateClaimDto {
  @ApiProperty()
  @IsString()
  facilityId: string;

  @ApiProperty({ example: '2024-01' })
  @IsString()
  yearMonth: string;

  @ApiProperty()
  @IsInt()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  billingDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateClaimDto extends PartialType(CreateClaimDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paymentDate?: Date;
}
