import { IsString, IsOptional, IsInt, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateFacilityDto {
  @ApiProperty({ description: '事業所名' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '事業所コード' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: '施設種別' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ required: false, description: '住所' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, description: '電話番号' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, description: 'メールアドレス' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, description: '定員' })
  @IsOptional()
  @IsInt()
  capacity?: number;

  @ApiProperty({ required: false, description: '事業所番号' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;
}

export class UpdateFacilityDto extends PartialType(CreateFacilityDto) {}
