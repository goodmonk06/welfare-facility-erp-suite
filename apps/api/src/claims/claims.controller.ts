import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClaimsService } from './claims.service';
import { CreateClaimDto, UpdateClaimDto } from './dto';

@ApiTags('claims')
@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  @ApiOperation({ summary: '請求一覧取得' })
  findAll(@Query('facilityId') facilityId: string) {
    return this.claimsService.findAll(facilityId);
  }

  @Get('summary')
  @ApiOperation({ summary: '請求サマリ取得' })
  getSummary(
    @Query('facilityId') facilityId: string,
    @Query('year') year?: number,
  ) {
    return this.claimsService.getSummary(facilityId, year);
  }

  @Get(':id')
  @ApiOperation({ summary: '請求詳細取得' })
  findOne(@Param('id') id: string) {
    return this.claimsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '請求新規作成' })
  create(@Body() createClaimDto: CreateClaimDto) {
    return this.claimsService.create(createClaimDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '請求更新' })
  update(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.update(id, updateClaimDto);
  }
}
