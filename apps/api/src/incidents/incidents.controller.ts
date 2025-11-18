import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto, UpdateIncidentDto } from './dto';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  @ApiOperation({ summary: 'インシデント一覧取得' })
  @ApiQuery({ name: 'facilityId', required: true, description: '事業所ID' })
  findAll(@Query('facilityId') facilityId: string) {
    return this.incidentsService.findAll(facilityId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'インシデント統計取得' })
  @ApiQuery({ name: 'facilityId', required: true, description: '事業所ID' })
  @ApiQuery({ name: 'startDate', required: false, description: '開始日（YYYY-MM-DD）', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, description: '終了日（YYYY-MM-DD）', example: '2024-12-31' })
  getStats(
    @Query('facilityId') facilityId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.incidentsService.getStats(
      facilityId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('critical')
  @ApiOperation({ summary: '直近の重大インシデント取得' })
  @ApiQuery({ name: 'facilityId', required: true, description: '事業所ID' })
  @ApiQuery({ name: 'days', required: false, description: '過去N日間', example: 7 })
  getCriticalIncidents(
    @Query('facilityId') facilityId: string,
    @Query('days') days?: string,
  ) {
    return this.incidentsService.getCriticalIncidents(
      facilityId,
      days ? parseInt(days, 10) : 7,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'インシデント詳細取得' })
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'インシデント新規登録' })
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'インシデント更新' })
  update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentsService.update(id, updateIncidentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'インシデント削除' })
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(id);
  }
}
